# studio/app/optinist/wrappers/expdb/my_new_analysis.py

import numpy as np

from studio.app.optinist.core.nwb.nwb import NWBDATASET


def my_new_analysis(
    stat,
    cnmf_info,
    output_dir,
    params=None,
    **kwargs,
) -> dict:
    """
    Implement a new analysis and visualization method

    Parameters
    ----------
    stat : StatData
        The statistics data object to update
    cnmf_info : dict
        Dictionary of CNMF output data
    output_dir : str
        Output directory for results
    params : dict, optional
        Parameters for the analysis

    Returns
    -------
    dict
        Dictionary of outputs including updated stat object and visualizations
    """
    # Get data from inputs
    fluorescence = cnmf_info["fluorescence"].data

    # Set default parameters if none provided
    if params is None:
        params = {
            "threshold": 0.5,
            "min_value": 0,
            "max_value": 1,
        }

    # Process data for your analysis
    my_result_data = process_my_data(fluorescence, params["threshold"])

    # Store results in StatData object
    stat.my_new_metric = my_result_data
    stat.my_summary_value = np.mean(my_result_data, axis=1)
    stat.index_responsive_cells = np.where(
        stat.my_summary_value >= params["threshold"], True, False
    )
    stat.ncells_responsive = np.sum(stat.index_responsive_cells)

    # Call the setter to create visualization objects
    stat.set_my_new_props()

    # Return updated stat object and visualization properties
    return {
        "stat": stat,
        "my_primary_plot": stat.my_primary_plot,
        "my_summary_plot": stat.my_summary_plot,
        "nwbfile": {NWBDATASET.ORISTATS: stat.nwb_dict_all},
    }


def process_my_data(data, threshold):
    """
    Process input data for the analysis

    Parameters
    ----------
    data : numpy.ndarray
        Raw input data to process
    threshold : float
        Processing threshold parameter

    Returns
    -------
    numpy.ndarray
        Processed data ready for visualization
    """
    # Implement your analysis algorithm
    processed_data = data.copy()

    # Example processing
    processed_data = processed_data - np.mean(processed_data, axis=1, keepdims=True)
    processed_data = processed_data / np.std(processed_data, axis=1, keepdims=True)

    # Apply threshold
    processed_data[processed_data < threshold] = threshold

    return processed_data
