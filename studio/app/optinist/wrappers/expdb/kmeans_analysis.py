import matplotlib.pyplot as plt
import numpy as np
from matplotlib.colors import ListedColormap
from sklearn.cluster import KMeans

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
        params = {"n_clusters": min(3, stat.ncells), "random_state": 42}

    # Calculate correlation matrix
    corr_matrix = np.corrcoef(fluorescence)

    # Perform clustering
    kmeans = KMeans(
        n_clusters=params["n_clusters"], random_state=params["random_state"]
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
    labels, corr_matrix, fluorescence, roi_masks, output_path
):
    """
    Generate detailed K-means visualization

    Parameters
    ----------
    labels : ndarray
        Cluster assignments for each cell
    corr_matrix : ndarray
        Cell-to-cell correlation matrix
    fluorescence : ndarray
        Temporal components/fluorescence traces (n_cells x time)
    roi_masks : ndarray
        ROI masks data (height x width x n_cells)
    output_path : str
        Path for saving the detailed output file
    """
    # Reorder correlation matrix based on clusters
    sort_idx = np.argsort(labels)
    sorted_corr_matrix = corr_matrix[sort_idx][:, sort_idx]

    # Calculate cluster information
    unique_clusters = np.unique(labels)
    n_clusters = len(unique_clusters)
    colors = plt.cm.jet(np.linspace(0, 1, n_clusters))
    custom_cmap = ListedColormap(colors)

    # Calculate mean time course for each cluster
    cluster_averages = []
    for cluster in unique_clusters:
        cluster_mask = labels == cluster
        cluster_avg = np.mean(fluorescence[cluster_mask], axis=0)
        cluster_averages.append(cluster_avg)

    # Generate cluster map
    cluster_map = np.zeros(roi_masks.shape[:2])
    for i, label in enumerate(labels):
        if i < roi_masks.shape[2]:
            roi_mask = roi_masks[..., i]
            cluster_map[roi_mask > 0] = label + 1

    # Create detailed visualization
    fig = plt.figure(figsize=(15, 10))

    # 1. Correlation matrix
    ax1 = fig.add_subplot(2, 2, 1)
    im1 = ax1.imshow(sorted_corr_matrix, cmap="jet")
    fig.colorbar(im1, ax=ax1)
    ax1.set_title(f"K-means Clustering (k={n_clusters})")
    ax1.set_xlabel("Cells")
    ax1.set_ylabel("Cells")

    # 2. Average time courses
    ax2 = fig.add_subplot(2, 2, 2)
    for i, avg in enumerate(cluster_averages):
        ax2.plot(avg, color=colors[i], linewidth=2, label=f"Cluster {i+1}")
    ax2.set_title("Mean Time Course by Cluster")
    ax2.set_xlabel("Time")
    ax2.set_ylabel("Fluorescence")
    ax2.legend()
    ax2.grid(True, alpha=0.3)

    # 3. Cell maps
    ax3 = fig.add_subplot(2, 1, 2)
    im3 = ax3.imshow(cluster_map, cmap=custom_cmap)
    fig.colorbar(im3, ax=ax3, label="Cluster")
    ax3.set_title("Cluster Assignments")

    plt.tight_layout()
    plt.savefig(output_path)
    plt.close()

    # Create thumbnail
    save_thumbnail(output_path)
