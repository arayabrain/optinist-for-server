from pynwb import get_class, load_namespaces

from studio.app.optinist.core.nwb.nwb_spec_utils import get_namespace_file_path
from studio.app.optinist.core.nwb.specs.marmoset_spec import NAME

load_namespaces(get_namespace_file_path(NAME))

SubjectMarmoset = get_class("SubjectMarmoset", NAME)
