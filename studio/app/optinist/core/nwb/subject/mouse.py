from pynwb import get_class, load_namespaces

from studio.app.optinist.core.nwb.nwb_spec_utils import get_namespace_file_path
from studio.app.optinist.core.nwb.specs.mouse_spec import NAME

load_namespaces(get_namespace_file_path(NAME))

SubjectMouse = get_class("SubjectMouse", NAME)
