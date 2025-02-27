import matplotlib.pyplot as plt
import numpy as np
from sklearn.decomposition import PCA

from studio.app.common.dataclass.utils import save_thumbnail
from studio.app.optinist.core.nwb.nwb import NWBDATASET
from studio.app.optinist.dataclass.stat import StatData


def pca_analysis(
    stat: StatData, cnmf_info: dict, output_dir: str, params: dict = None, **kwargs
) -> dict:
    """Perform PCA analysis on CNMF results"""

    fluorescence = cnmf_info["fluorescence"].data

    # Set default parameters if none provided
    if params is None:
        params = {"n_components": min(10, stat.ncells), "standard_norm": True}

    # Prepare data
    if params.get("standard_norm", True):
        # Center the data
        data = fluorescence - np.mean(fluorescence, axis=1, keepdims=True)
        # Scale to unit variance
        data = data / np.std(data, axis=1, keepdims=True)
    else:
        data = fluorescence

    # Perform PCA
    pca = PCA(n_components=params["n_components"])
    scores = pca.fit_transform(data.T)  # time x components
    components = pca.components_  # components x cells
    explained_variance = pca.explained_variance_ratio_ * 100

    # Store results in StatData
    stat.pca_scores = scores
    stat.pca_components = components
    stat.pca_explained_variance = explained_variance

    # Store ROI masks for visualization
    stat.roi_masks = cnmf_info["cell_roi"].data

    # Create visualization objects within the function
    stat.set_pca_props()

    # Add to nwbfile if needed
    nwbfile = kwargs.get("nwbfile", {})
    pca_dict = {
        "pca_scores": scores,
        "pca_components": components,
        "pca_explained_variance": explained_variance,
    }
    nwbfile = {
        NWBDATASET.ORISTATS: {**nwbfile.get(NWBDATASET.ORISTATS, {}), **pca_dict}
    }

    return {
        "stat": stat,
        "pca_analysis": stat.pca_analysis,
        "pca_analysis_variance": stat.pca_analysis_variance,
        "pca_contribution": stat.pca_contribution,
        "nwbfile": nwbfile,
    }


def generate_pca_visualization(
    scores, explained_variance, components, roi_masks, output_path
):
    """
    Generate PCA visualization with side-by-side plots for time course and spatial maps

    Parameters
    ----------
    scores : ndarray
        PCA scores matrix (time x components)
    explained_variance : ndarray
        Explained variance percentages
    components : ndarray
        PCA components matrix (components x cells)
    roi_masks : ndarray
        ROI masks data (height x width x n_cells)
    output_path : str
        Path for saving the detailed output file
    """
    # Number of components to visualize (limit to 3)
    num_components = min(3, components.shape[0], scores.shape[1])

    # Create a figure with subplots for explained variance and components
    fig = plt.figure(figsize=(15, 10))

    # Plot explained variance
    ax1 = fig.add_subplot(2, 2, 1)
    num_display = min(10, len(explained_variance))
    ax1.bar(range(1, num_display + 1), explained_variance[:num_display])
    ax1.set_title("Explained Variance")
    ax1.set_xlabel("Principal Component")
    ax1.set_ylabel("Explained Variance (%)")
    ax1.grid(True, alpha=0.3)

    # Plot component visualizations side-by-side (time course + spatial map)
    for i in range(num_components):
        # First row of component plots - time courses
        ax_time = fig.add_subplot(3, num_components, num_components + i + 1)
        ax_time.plot(scores[:, i], linewidth=2)
        ax_time.set_title(f"PC {i+1} Time Course")
        ax_time.set_xlabel("Time")
        ax_time.set_ylabel("Component Value")
        ax_time.grid(True, alpha=0.3)

        # Second row of component plots - spatial maps
        ax_space = fig.add_subplot(3, num_components, 2 * num_components + i + 1)

        # Create spatial map from component weights
        component_weights = np.abs(components[i])
        component_map = np.zeros(roi_masks.shape[:2])
        for cell_idx in range(roi_masks.shape[2]):
            if cell_idx < len(component_weights):
                weight = component_weights[cell_idx]
                roi_mask = roi_masks[..., cell_idx]
                component_map[roi_mask > 0] = weight

        im = ax_space.imshow(component_map, cmap="viridis")
        fig.colorbar(im, ax=ax_space)
        ax_space.set_title(f"PC {i+1} Spatial Map")

    plt.tight_layout()
    plt.savefig(output_path)
    plt.close()

    # Create thumbnail
    save_thumbnail(output_path)
