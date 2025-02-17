from studio.app.common.routers.algolist import NestDictGetter
from studio.app.common.schemas.algolist import Algo
from studio.app.wrappers import wrapper_dict

ALGO_TOP_GROUP = "expdb"


def test_run(client):
    response = client.get("/algolist")
    output = response.json()

    assert response.status_code == 200
    assert isinstance(output, dict)

    assert ALGO_TOP_GROUP in output
    output_lv1 = output[ALGO_TOP_GROUP]

    assert "children" in output_lv1
    output_lv2 = output_lv1["children"]

    assert "analysis_preset" in output_lv2
    output_lv3 = output_lv2["analysis_preset"]

    assert "children" in output_lv3
    output_lv4 = output_lv3["children"]

    assert "analyze_stats" in output_lv4
    output_lv5 = output_lv4["analyze_stats"]

    assert "args" in output_lv5
    assert "path" in output_lv5

    assert "preset_components" in output_lv2


def test_NestDictGetter():
    output = NestDictGetter.get_nest_dict(wrapper_dict, "")

    assert isinstance(output, dict)

    assert ALGO_TOP_GROUP in output
    output_lv1 = output[ALGO_TOP_GROUP]

    assert "children" in output_lv1
    output_lv2 = output_lv1["children"]

    assert "analysis_preset" in output_lv2
    output_lv3 = output_lv2["analysis_preset"]

    assert "children" in output_lv3
    output_lv4 = output_lv3["children"]

    assert "analyze_stats" in output_lv4
    output_lv5 = output_lv4["analyze_stats"]

    assert isinstance(
        output_lv5,
        Algo,
    )
