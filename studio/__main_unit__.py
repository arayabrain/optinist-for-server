import argparse

import uvicorn
from fastapi import Depends, FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi_pagination import add_pagination
from starlette.middleware.cors import CORSMiddleware

from studio.app.common.core.auth.auth_dependencies import (
    get_admin_user,
    get_current_user,
)
from studio.app.common.routers import (
    algolist,
    auth,
    experiment,
    files,
    outputs,
    params,
    run,
    users_admin,
    users_me,
    users_search,
    workspace,
)
from studio.app.dir_path import DIRPATH
from studio.app.optinist.routers import expdb, hdf5, nwb, roi

app = FastAPI(docs_url="/docs", openapi_url="/openapi")

add_pagination(app)

# common routers
app.include_router(algolist.router, dependencies=[Depends(get_current_user)])
app.include_router(auth.router)
app.include_router(experiment.router, dependencies=[Depends(get_current_user)])
app.include_router(files.router, dependencies=[Depends(get_current_user)])
app.include_router(outputs.router, dependencies=[Depends(get_current_user)])
app.include_router(params.router, dependencies=[Depends(get_current_user)])
app.include_router(run.router, dependencies=[Depends(get_current_user)])
app.include_router(users_admin.router, dependencies=[Depends(get_admin_user)])
app.include_router(users_me.router, dependencies=[Depends(get_current_user)])
app.include_router(users_search.router, dependencies=[Depends(get_current_user)])
app.include_router(workspace.router, dependencies=[Depends(get_current_user)])

# optinist routers
app.include_router(hdf5.router, dependencies=[Depends(get_current_user)])
app.include_router(nwb.router, dependencies=[Depends(get_current_user)])
app.include_router(roi.router, dependencies=[Depends(get_current_user)])
app.include_router(expdb.public_router)
app.include_router(expdb.router, dependencies=[Depends(get_current_user)])


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FRONTEND_DIRPATH = DIRPATH.ROOT_DIR + "/frontend"

app.mount(
    "/static",
    StaticFiles(directory=f"{FRONTEND_DIRPATH}/build/static"),
    name="static",
)

if DIRPATH.GRAPH_HOST is None:
    app.mount(
        "/datasets",
        StaticFiles(directory=DIRPATH.PUBLIC_EXPDB_DIR),
        name="datasets",
    )

templates = Jinja2Templates(directory=f"{FRONTEND_DIRPATH}/build")


@app.get("/")
async def root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


def main(develop_mode: bool = False):
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", type=str, default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--reload", action="store_true")
    args = parser.parse_args()

    # set fastapi@uvicorn logging config.
    log_format = "%(asctime)s  %(levelprefix)s %(message)s"
    fastapi_logging_config = uvicorn.config.LOGGING_CONFIG
    fastapi_logging_config["formatters"]["default"]["fmt"] = log_format
    fastapi_logging_config["formatters"]["access"]["fmt"] = log_format

    if develop_mode:
        reload_options = {"reload_dirs": ["studio"]} if args.reload else {}
        uvicorn.run(
            "studio.__main_unit__:app",
            host=args.host,
            port=args.port,
            log_config=fastapi_logging_config,
            reload=args.reload,
            **reload_options,
        )
    else:
        uvicorn.run(
            "studio.__main_unit__:app",
            host=args.host,
            port=args.port,
            log_config=fastapi_logging_config,
            reload=False,
        )
