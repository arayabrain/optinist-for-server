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
    assert "children" in output[ALGO_TOP_GROUP]
    assert "analysis_preset" in output[ALGO_TOP_GROUP]["children"]
    assert "children" in output[ALGO_TOP_GROUP]["children"]["analysis_preset"]
    assert "analyze_stats" in output[ALGO_TOP_GROUP]["children"]["analysis_preset"]["children"]

    assert (
        "args" in output[ALGO_TOP_GROUP]["children"]["analysis_preset"]["children"]["analyze_stats"]
    )
    assert (
        "path" in output[ALGO_TOP_GROUP]["children"]["analysis_preset"]["children"]["analyze_stats"]
    )
    assert "preset_components" in output[ALGO_TOP_GROUP]["children"]


def test_NestDictGetter():
    output = NestDictGetter.get_nest_dict(wrapper_dict, "")

    assert isinstance(output, dict)
    assert ALGO_TOP_GROUP in output
    assert "children" in output[ALGO_TOP_GROUP]
    assert "analysis_preset" in output[ALGO_TOP_GROUP]["children"]
    assert "children" in output[ALGO_TOP_GROUP]["children"]["analysis_preset"]
    assert "analyze_stats" in output[ALGO_TOP_GROUP]["children"]["analysis_preset"]["children"]

    assert isinstance(
        output[ALGO_TOP_GROUP]["children"]["analysis_preset"]["children"]["analyze_stats"], Algo
    )
