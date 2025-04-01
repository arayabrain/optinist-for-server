# studio/app/optinist/wrappers/expdb/my_new_analysis.py
# Add this: A new analysis function
import numpy as np

from studio.app.common.core.logger import AppLogger
from studio.app.optinist.core.nwb.nwb import NWBDATASET
from studio.app.optinist.dataclass import StatData


def my_new_analysis(
    stat: StatData, output_dir: str, params: dict = None, **kwargs
) -> dict(stat=StatData):
    """
    Implement a new analysis and visualization method

    Parameters
    ----------
    stat : StatData
        The statistics data object to update
    output_dir : str
        Output directory for results
    params : dict, optional
        Parameters for the analysis

    Returns
    -------
    dict
        Dictionary of outputs including updated stat object and visualizations
    """
    logger = AppLogger.get_logger()
    logger.info("Running my_new_analysis...")
    # Set default parameters if none provided
    if params is None:
        params = {
            "threshold": 0.5,
        }

    # Process data and calculate summary statistics
    all_processed_data = []
    mean_data = np.zeros(stat.ncells)

    for i in range(stat.ncells):
        processed = process_my_data(stat.data_table[i])
        all_processed_data.append(processed)
        mean_data[i] = np.mean(processed)  # Summary statistic (mean)

    # Create 3D array from processed data
    if all_processed_data:
        first_array = all_processed_data[0]
        if hasattr(first_array, "shape"):
            rows, cols = first_array.shape
            stat.my_new_metric = np.array(all_processed_data).reshape(
                len(all_processed_data), rows, cols
            )

    # Store results and calculate responsive cells
    stat.my_summary_value = mean_data
    stat.index_responsive_cells = mean_data >= params["threshold"]
    stat.ncells_responsive = np.sum(stat.index_responsive_cells)

    # Call the setter to create visualization objects
    stat.set_my_new_props()

    # Return updated stat object and visualization properties
    return {
        "stat": stat,
        "my_primary_plot": stat.my_primary_plot,
        "my_summary_plot": stat.my_summary_plot,
        "nwbfile": {NWBDATASET.ORISTATS: stat.nwb_dict_my_new_analysis},
    }


def process_my_data(data):
    """
    Process input data for the analysis

    Parameters
    ----------
    data : numpy.ndarray
        Raw input data to process

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

    return processed_data
