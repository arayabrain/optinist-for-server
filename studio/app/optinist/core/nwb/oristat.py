from pynwb import get_class, load_namespaces
from pynwb.spec import NWBDatasetSpec, NWBGroupSpec, NWBNamespaceBuilder

name = "oristats"
ns_path = f"{name}.namespace.yaml"
ext_source = f"{name}.extensions.yaml"

oristat_ext = NWBGroupSpec(
    doc="oristats",
    datasets=[
        NWBDatasetSpec(doc="best_dir", name="best_dir", dtype="float", shape=(None,)),
        NWBDatasetSpec(
            doc="best_dir_fit", name="best_dir_fit", dtype="float", shape=(None,)
        ),
        NWBDatasetSpec(
            doc="best_dir_interp", name="best_dir_interp", dtype="float", shape=(None,)
        ),
        NWBDatasetSpec(doc="best_ori", name="best_ori", dtype="float", shape=(None,)),
        NWBDatasetSpec(
            doc="best_ori_fit", name="best_ori_fit", dtype="float", shape=(None,)
        ),
        NWBDatasetSpec(
            doc="data_table",
            name="data_table",
            dtype="float",
            shape=[(None, None), (None, None, None), (None, None, None, None)],
        ),
        NWBDatasetSpec(doc="di", name="di", dtype="float", shape=(None,)),
        NWBDatasetSpec(doc="di_fit", name="di_fit", dtype="float", shape=(None,)),
        NWBDatasetSpec(doc="di_interp", name="di_interp", dtype="float", shape=(None,)),
        NWBDatasetSpec(doc="dir_a1", name="dir_a1", dtype="float", shape=(None,)),
        NWBDatasetSpec(doc="dir_a2", name="dir_a2", dtype="float", shape=(None,)),
        NWBDatasetSpec(doc="dir_k1", name="dir_k1", dtype="float", shape=(None,)),
        NWBDatasetSpec(doc="dir_k2", name="dir_k2", dtype="float", shape=(None,)),
        NWBDatasetSpec(
            doc="dir_ratio_change",
            name="dir_ratio_change",
            dtype="float",
            shape=(None, None),
        ),
        NWBDatasetSpec(doc="dir_sig", name="dir_sig", dtype="float", shape=(None,)),
        NWBDatasetSpec(
            doc="dir_tuning_width",
            name="dir_tuning_width",
            dtype="float",
            shape=(None,),
        ),
        NWBDatasetSpec(
            doc="dir_vector_angle",
            name="dir_vector_angle",
            dtype="float",
            shape=(None,),
        ),
        NWBDatasetSpec(
            doc="dir_vector_mag", name="dir_vector_mag", dtype="float", shape=(None,)
        ),
        NWBDatasetSpec(
            doc="dir_vector_tune", name="dir_vector_tune", dtype="float", shape=(None,)
        ),
        NWBDatasetSpec(doc="ds", name="ds", dtype="float", shape=(None,)),
        NWBDatasetSpec(doc="dsi", name="dsi", dtype="float", shape=(None,)),
        NWBDatasetSpec(
            doc="index_direction_selective_cell",
            name="index_direction_selective_cell",
            dtype="bool",
            shape=(None,),
        ),
        NWBDatasetSpec(
            doc="index_orientation_selective_cell",
            name="index_orientation_selective_cell",
            dtype="bool",
            shape=(None,),
        ),
        NWBDatasetSpec(
            doc="index_visually_responsive_cell",
            name="index_visually_responsive_cell",
            dtype="bool",
            shape=(None,),
        ),
        NWBDatasetSpec(doc="ncells", name="ncells", dtype="int"),
        NWBDatasetSpec(
            doc="ncells_direction_selective_cell",
            name="ncells_direction_selective_cell",
            dtype="int",
        ),
        NWBDatasetSpec(
            doc="ncells_orientation_selective_cell",
            name="ncells_orientation_selective_cell",
            dtype="int",
        ),
        NWBDatasetSpec(
            doc="ncells_visually_responsive_cell",
            name="ncells_visually_responsive_cell",
            dtype="int",
        ),
        NWBDatasetSpec(doc="nstim", name="nstim", dtype="int"),
        NWBDatasetSpec(doc="nstim_per_trial", name="nstim_per_trial", dtype="int"),
        NWBDatasetSpec(doc="nstimplus", name="nstimplus", dtype="int"),
        NWBDatasetSpec(doc="ntrials", name="ntrials", dtype="int"),
        NWBDatasetSpec(doc="null_dir", name="null_dir", dtype="float", shape=(None,)),
        NWBDatasetSpec(
            doc="null_dir_fit", name="null_dir_fit", dtype="float", shape=(None,)
        ),
        NWBDatasetSpec(
            doc="null_dir_interp", name="null_dir_interp", dtype="float", shape=(None,)
        ),
        NWBDatasetSpec(doc="null_ori", name="null_ori", dtype="float", shape=(None,)),
        NWBDatasetSpec(doc="oi", name="oi", dtype="float", shape=(None,)),
        NWBDatasetSpec(doc="ori_a1", name="ori_a1", dtype="float", shape=(None,)),
        NWBDatasetSpec(doc="ori_k1", name="ori_k1", dtype="float", shape=(None,)),
        NWBDatasetSpec(
            doc="ori_ratio_change",
            name="ori_ratio_change",
            dtype="float",
            shape=(None, None),
        ),
        NWBDatasetSpec(
            doc="ori_tuning_width",
            name="ori_tuning_width",
            dtype="float",
            shape=(None,),
        ),
        NWBDatasetSpec(
            doc="ori_vector_angle",
            name="ori_vector_angle",
            dtype="float",
            shape=(None,),
        ),
        NWBDatasetSpec(
            doc="ori_vector_mag", name="ori_vector_mag", dtype="float", shape=(None,)
        ),
        NWBDatasetSpec(
            doc="ori_vector_tune", name="ori_vector_tune", dtype="float", shape=(None,)
        ),
        NWBDatasetSpec(doc="osi", name="osi", dtype="float", shape=(None,)),
        NWBDatasetSpec(
            doc="p_value_ori_resp",
            name="p_value_ori_resp",
            dtype="float",
            shape=(None,),
        ),
        NWBDatasetSpec(
            doc="p_value_ori_sel", name="p_value_ori_sel", dtype="float", shape=(None,)
        ),
        NWBDatasetSpec(
            doc="p_value_resp", name="p_value_resp", dtype="float", shape=(None,)
        ),
        NWBDatasetSpec(
            doc="p_value_sel", name="p_value_sel", dtype="float", shape=(None,)
        ),
        NWBDatasetSpec(
            doc="p_value_threshold", name="p_value_threshold", dtype="float"
        ),
        NWBDatasetSpec(
            doc="r_best_dir", name="r_best_dir", dtype="float", shape=(None,)
        ),
        NWBDatasetSpec(
            doc="r_best_dir_fit", name="r_best_dir_fit", dtype="float", shape=(None,)
        ),
        NWBDatasetSpec(
            doc="r_best_dir_interp",
            name="r_best_dir_interp",
            dtype="float",
            shape=(None,),
        ),
        NWBDatasetSpec(
            doc="r_best_ori", name="r_best_ori", dtype="float", shape=(None,)
        ),
        NWBDatasetSpec(doc="r_best_threshold", name="r_best_threshold", dtype="float"),
        NWBDatasetSpec(doc="r_min_dir", name="r_min_dir", dtype="float", shape=(None,)),
        NWBDatasetSpec(doc="r_min_ori", name="r_min_ori", dtype="float", shape=(None,)),
        NWBDatasetSpec(
            doc="r_null_dir", name="r_null_dir", dtype="float", shape=(None,)
        ),
        NWBDatasetSpec(
            doc="r_null_dir_fit", name="r_null_dir_fit", dtype="float", shape=(None,)
        ),
        NWBDatasetSpec(
            doc="r_null_dir_interp",
            name="r_null_dir_interp",
            dtype="float",
            shape=(None,),
        ),
        NWBDatasetSpec(
            doc="r_null_ori", name="r_null_ori", dtype="float", shape=(None,)
        ),
        NWBDatasetSpec(doc="si_threshold", name="si_threshold", dtype="float"),
        NWBDatasetSpec(
            doc="sig_epochs_ori_resp",
            name="sig_epochs_ori_resp",
            dtype="float",
            shape=(None, None, None),
        ),
        NWBDatasetSpec(
            doc="sig_epochs_ori_sel",
            name="sig_epochs_ori_sel",
            dtype="float",
            shape=(None, None, None),
        ),
        NWBDatasetSpec(
            doc="sig_epochs_resp",
            name="sig_epochs_resp",
            dtype="float",
            shape=(None, None, None),
        ),
        NWBDatasetSpec(
            doc="sig_epochs_sel",
            name="sig_epochs_sel",
            dtype="float",
            shape=(None, None, None),
        ),
        NWBDatasetSpec(
            doc="tuning_curve", name="tuning_curve", dtype="float", shape=(None, None)
        ),
        NWBDatasetSpec(
            doc="tuning_curve_polar",
            name="tuning_curve_polar",
            dtype="float",
            shape=(None, None),
        ),
        NWBDatasetSpec(
            doc="direction_responsivity_ratio",
            name="direction_responsivity_ratio",
            dtype="float",
            shape=(None, None),
        ),
        NWBDatasetSpec(
            doc="orientation_responsivity_ratio",
            name="orientation_responsivity_ratio",
            dtype="float",
            shape=(None, None),
        ),
        NWBDatasetSpec(
            doc="direction_selectivity",
            name="direction_selectivity",
            dtype="float",
            shape=(None, None),
        ),
        NWBDatasetSpec(
            doc="orientation_selectivity",
            name="orientation_selectivity",
            dtype="float",
            shape=(None, None),
        ),
        NWBDatasetSpec(
            doc="best_responsivity",
            name="best_responsivity",
            dtype="float",
            shape=(None, None),
        ),
        NWBDatasetSpec(
            doc="preferred_direction",
            name="preferred_direction",
            dtype="float",
            shape=(None, None),
        ),
        NWBDatasetSpec(
            doc="preferred_orientation",
            name="preferred_orientation",
            dtype="float",
            shape=(None, None),
        ),
        NWBDatasetSpec(
            doc="direction_tuning_width",
            name="direction_tuning_width",
            dtype="float",
            shape=(None, None),
        ),
        NWBDatasetSpec(
            doc="orientation_tuning_width",
            name="orientation_tuning_width",
            dtype="float",
            shape=(None, None),
        ),
    ],
    name="oristats",
    neurodata_type_def="Oristats",
    neurodata_type_inc="NWBContainer",
)

ns_builder = NWBNamespaceBuilder(f"{name} extensions", name, version="0.1.0")
ns_builder.add_spec(ext_source, oristat_ext)
ns_builder.export(ns_path)
load_namespaces(ns_path)

Oristats = get_class("Oristats", name)
