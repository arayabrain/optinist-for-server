import matplotlib.pyplot as plt
import numpy as np
from sklearn.decomposition import PCA

from studio.app.common.core.utils.filepath_creater import join_filepath
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
    else:
        # Extract parameters from the nested structure if present
        pca_params = params.get("PCA", {})
        params = {
            "n_components": pca_params.get("n_components", min(10, stat.ncells)),
            "standard_norm": params.get("standard_mean", True)
            or params.get("standard_std", True),
        }

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
    scores, explained_variance, components, roi_masks, output_dir
):
    """
    Generate PCA visualization with separate files for each component

    Parameters
    ----------
    scores : ndarray
        PCA scores matrix (time x components)
    explained_variance : ndarray
        Explained variance percentages
    components : ndarray
        PCA components matrix (components x cells)
    roi_masks : ndarray or None
        ROI masks data in any format
    output_dir : str
        Directory for saving output files
    """
    # Number of components to visualize
    if components is None or scores is None:
        print("Warning: Missing PCA components or scores")
        return

    num_components = min(3, components.shape[0], scores.shape[1])

    # 1. Plot explained variance
    plt.figure()
    num_display = min(10, len(explained_variance))
    plt.bar(range(1, num_display + 1), explained_variance[:num_display])
    plt.title("Explained Variance")
    plt.xlabel("Principal Component")
    plt.ylabel("Explained Variance (%)")
    plt.grid(True, alpha=0.3)

    variance_path = join_filepath([output_dir, "pca_analysis_variance.png"])
    plt.savefig(variance_path, bbox_inches="tight")
    plt.close()
    save_thumbnail(variance_path)

    # 2. Create PCA scatter plot (first 2-3 components)
    plt.figure()
    if scores.shape[1] >= 2:
        plt.scatter(scores[:, 0], scores[:, 1], alpha=0.7)
        plt.xlabel("PC 1")
        plt.ylabel("PC 2")

        if scores.shape[1] >= 3:
            plt.figure()
            plt.scatter(
                scores[:, 0], scores[:, 1], c=scores[:, 2], cmap="viridis", alpha=0.7
            )
            plt.colorbar(label="PC 3")
            plt.xlabel("PC 1")
            plt.ylabel("PC 2")

    scatter_path = join_filepath([output_dir, "pca_analysis.png"])
    plt.savefig(scatter_path, bbox_inches="tight")
    plt.close()
    save_thumbnail(scatter_path)

    # 3. For each component, create time course and spatial map (if possible)
    for i in range(num_components):
        # Time course
        plt.figure()
        plt.plot(scores[:, i], linewidth=2)
        plt.title(f"PC {i+1} Time Course")
        plt.xlabel("Time")
        plt.ylabel("Component Value")
        plt.grid(True, alpha=0.3)

        time_path = join_filepath([output_dir, f"pca_component_{i+1}_time.png"])
        plt.savefig(time_path, bbox_inches="tight")
        plt.close()
        save_thumbnail(time_path)

        # Spatial map - attempt only if roi_masks has appropriate shape
        component_weights = np.abs(components[i])

        if roi_masks is not None and hasattr(roi_masks, "shape"):
            try:
                # Check for 3D mask (standard case with multiple ROIs)
                if len(roi_masks.shape) == 3:
                    component_map = np.zeros(roi_masks.shape[:2])
                    for cell_idx in range(
                        min(roi_masks.shape[2], len(component_weights))
                    ):
                        weight = component_weights[cell_idx]
                        roi_mask = roi_masks[:, :, cell_idx]
                        component_map[roi_mask > 0] = weight

                # Simpler 2D mask case
                elif len(roi_masks.shape) == 2:
                    component_map = np.zeros(roi_masks.shape)
                    # Use mean weight for the mask
                    if len(component_weights) > 0:
                        component_map[roi_masks > 0] = np.mean(component_weights)

                # If valid component map was created, plot it
                if "component_map" in locals():
                    plt.figure()
                    im = plt.imshow(component_map, cmap="viridis")
                    plt.colorbar(im, label="Component Weight")
                    plt.title(f"PC {i+1} Spatial Map")

                    spatial_path = join_filepath(
                        [output_dir, f"pca_component_{i+1}_spatial.png"]
                    )
                    plt.savefig(spatial_path, bbox_inches="tight")
                    plt.close()
                    save_thumbnail(spatial_path)
            except Exception as e:
                print(f"Could not create spatial map for PC {i+1}: {str(e)}")

    # Save the contribution weights as a separate visualization
    plt.figure()
    top_n = min(5, components.shape[0])
    for i in range(top_n):
        plt.bar(
            range(len(components[i])),
            np.abs(components[i]),
            alpha=0.7,
            label=f"PC {i+1}",
        )
    plt.xlabel("Cell Index")
    plt.ylabel("Absolute Weight")
    plt.title("PCA Component Contributions")
    plt.legend()
    plt.grid(True, alpha=0.3)

    contrib_path = join_filepath([output_dir, "pca_contribution.png"])
    plt.savefig(contrib_path, bbox_inches="tight")
    plt.close()
    save_thumbnail(contrib_path)
