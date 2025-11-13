# from studio.app.common.wrappers import wrapper_dict as common_wrapper_dict
from studio.app.optinist.wrappers import expdb_wrapper_dict
from studio.app.optinist.wrappers import wrapper_dict as optinist_wrapper_dict

wrapper_dict = {}
# wrapper_dict.update(**common_wrapper_dict)
wrapper_dict.update(**optinist_wrapper_dict)

wrapper_expdb_dict = {}
wrapper_expdb_dict.update(**expdb_wrapper_dict)
