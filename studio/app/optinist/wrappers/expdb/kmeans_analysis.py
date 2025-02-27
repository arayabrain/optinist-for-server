import matplotlib.pyplot as plt
import numpy as np
from matplotlib.colors import ListedColormap
from sklearn.cluster import KMeans

from studio.app.common.core.utils.filepath_creater import join_filepath
from studio.app.common.dataclass.utils import save_thumbnail
from studio.app.optinist.core.nwb.nwb import NWBDATASET
from studio.app.optinist.dataclass.stat import StatData


def kmeans_analysis(
    stat: StatData, cnmf_info: dict, output_dir: str, params: dict = None, **kwargs
) -> dict:
    """Perform KMeans clustering analysis on CNMF results"""

    fluorescence = cnmf_info["fluorescence"].data

    # Set default parameters if none provided
    if params is None:
        params = {"n_clusters": min(3, stat.ncells)}

    # Calculate correlation matrix
    corr_matrix = np.corrcoef(fluorescence)

    # Perform clustering
    kmeans = KMeans(
        n_clusters=params["n_clusters"],
    )
    cluster_labels = kmeans.fit_predict(corr_matrix)

    # Store results in StatData
    stat.cluster_labels = cluster_labels
    stat.cluster_corr_matrix = corr_matrix

    # Store data needed for visualization
    stat.fluorescence = fluorescence
    if not hasattr(stat, "roi_masks") or stat.roi_masks is None:
        stat.roi_masks = cnmf_info["cell_roi"].data

    # Create visualization objects within the function
    stat.set_kmeans_props()

    # Add to nwbfile if needed
    nwbfile = kwargs.get("nwbfile", {})
    clustering_dict = {
        "cluster_labels": cluster_labels,
        "cluster_corr_matrix": corr_matrix,
    }
    nwbfile = {
        NWBDATASET.ORISTATS: {**nwbfile.get(NWBDATASET.ORISTATS, {}), **clustering_dict}
    }

    return {
        "stat": stat,
        "clustering_analysis": stat.clustering_analysis,
        "nwbfile": nwbfile,
    }


def generate_kmeans_visualization(
    labels, corr_matrix, fluorescence, roi_masks, output_dir
):
    """
    Generate KMeans visualizations with separate files for each component

    Parameters
    ----------
    labels : ndarray
        Cluster assignments for each cell
    corr_matrix : ndarray
        Cell-to-cell correlation matrix
    fluorescence : ndarray
        Temporal components/fluorescence traces (n_cells x time)
    roi_masks : ndarray or None
        ROI masks data in any format
    output_dir : str
        Directory for saving output files
    """
    if labels is None or len(labels) == 0:
        print("Warning: Missing cluster labels")
        return

    # Reorder correlation matrix based on clusters
    sort_idx = np.argsort(labels)
    sorted_corr_matrix = corr_matrix[sort_idx][:, sort_idx]

    # Calculate cluster information
    unique_clusters = np.unique(labels)
    n_clusters = len(unique_clusters)
    colors = plt.cm.jet(np.linspace(0, 1, n_clusters))
    custom_cmap = ListedColormap(colors)

    # 1. Correlation matrix heatmap
    plt.figure()
    im = plt.imshow(sorted_corr_matrix, cmap="jet")
    plt.colorbar(im)
    plt.title(f"K-means Clustering (k={n_clusters})")
    plt.xlabel("Cells")
    plt.ylabel("Cells")

    matrix_path = join_filepath([output_dir, "clustering_analysis.png"])
    plt.savefig(matrix_path, bbox_inches="tight")
    plt.close()
    save_thumbnail(matrix_path)

    # 2. Mean time courses by cluster
    if fluorescence is not None and fluorescence.shape[0] >= len(labels):
        plt.figure()
        cluster_averages = []

        for i, cluster in enumerate(unique_clusters):
            cluster_mask = labels == cluster
            if np.any(cluster_mask):
                cluster_avg = np.mean(fluorescence[cluster_mask], axis=0)
                plt.plot(
                    cluster_avg, color=colors[i], linewidth=2, label=f"Cluster {i+1}"
                )
                cluster_averages.append(cluster_avg)

        plt.title("Mean Time Course by Cluster")
        plt.xlabel("Time")
        plt.ylabel("Fluorescence")
        plt.legend()
        plt.grid(True, alpha=0.3)

        time_path = join_filepath([output_dir, "cluster_time_courses.png"])
        plt.savefig(time_path, bbox_inches="tight")
        plt.close()
        save_thumbnail(time_path)

    # 3. Spatial cluster map - attempt only if roi_masks has appropriate shape
    if roi_masks is not None and hasattr(roi_masks, "shape"):
        try:
            # Check for 3D mask (standard case with multiple ROIs)
            if len(roi_masks.shape) == 3:
                cluster_map = np.zeros(roi_masks.shape[:2])
                for i, label in enumerate(labels):
                    if i < roi_masks.shape[2]:
                        roi_mask = roi_masks[:, :, i]
                        cluster_map[roi_mask > 0] = label + 1

            # Simpler 2D mask case
            elif len(roi_masks.shape) == 2:
                cluster_map = np.zeros(roi_masks.shape)
                # Use most common cluster for the mask
                if len(labels) > 0:
                    counts = np.bincount(labels)
                    most_common = np.argmax(counts) if len(counts) > 0 else 0
                    cluster_map[roi_masks > 0] = most_common + 1

            # If valid cluster map was created, plot it
            if "cluster_map" in locals():
                plt.figure()
                im = plt.imshow(cluster_map, cmap=custom_cmap)
                plt.colorbar(im, label="Cluster")
                plt.title("Cluster Assignments")

                map_path = join_filepath([output_dir, "cluster_spatial_map.png"])
                plt.savefig(map_path, bbox_inches="tight")
                plt.close()
                save_thumbnail(map_path)
        except Exception as e:
            print(f"Could not create cluster spatial map: {str(e)}")
