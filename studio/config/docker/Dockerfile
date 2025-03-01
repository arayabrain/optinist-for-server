FROM --platform=linux/amd64 python:3.8.20-slim

WORKDIR /app

# ----------------------------------------
# install default packages
# ----------------------------------------

RUN apt-get --allow-releaseinfo-change update && \
    apt-get install --no-install-recommends -y sudo procps iproute2 iputils-ping telnet wget curl unzip less vim

# ----------------------------------------
# add operational user
# ----------------------------------------

RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers && \
    useradd -u 500 -g www-data -G sudo --create-home -s /bin/bash optinist && \
    chown optinist /app && \
    echo 'alias ll="ls -la --color=auto"' >> /root/.bashrc && \
    echo 'set nu ic hls nowrap ts=4 sw=4 | syntax on' >> /root/.vimrc && \
    cp /root/.bashrc /root/.vimrc /home/optinist/

# ----------------------------------------
# install conda & packages
# ----------------------------------------

RUN apt-get install --no-install-recommends -y gcc g++ libgl1 libgl1-mesa-dev libopencv-dev && \
    apt-get autoremove -y && apt-get clean
RUN mkdir -p /opt/miniforge && \
    curl -L "https://github.com/conda-forge/miniforge/releases/latest/download/Miniforge3-$(uname)-$(uname -m).sh" -o /opt/miniforge/Miniforge3.sh && \
    bash /opt/miniforge/Miniforge3.sh -b -u -p /opt/miniforge && \
    rm /opt/miniforge/Miniforge3.sh && \
    export PATH="$PATH:/opt/miniforge/bin" && \
    conda upgrade -y --all && \
    conda config --set channel_priority flexible && \
    conda clean -y --all
ENV PATH $PATH:/opt/miniforge/bin

# setup cron
RUN ln -snf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && echo "Asia/Tokyo" > /etc/timezone && \
    apt-get install --no-install-recommends -y cron rsyslog && \
    echo "cron.*  /var/log/cron.log" > /etc/rsyslog.d/50-default.conf && \
    echo 'sudo service rsyslog start''\n''sudo service cron start' >> ./init_docker_services.sh

# ----------------------------------------
# setup optinist batch environment #1
# ----------------------------------------

# Note: In this section, a batch-only conda environment is created
# with the privileges of a working user (optinist).

# Change to application user
USER optinist

# conda init
RUN conda config --set channel_priority flexible && \
    conda init bash

# conda env create
COPY --chown=optinist studio/app/optinist/wrappers/caiman/conda/caiman_with_expdb.yaml /app/studio/conda_expdb_batch.yaml
RUN . ~/.bashrc && \
    conda env create -n expdb_batch -f /app/studio/conda_expdb_batch.yaml && \
    conda clean -y --all --force-pkgs-dirs

# Return to root user
USER root

# ----------------------------------------
# setup optinist application environment #1
# ----------------------------------------

# pip install
# * copy only minimal files to enable docker run cache.
COPY --chown=optinist pyproject.toml poetry.lock ./
RUN pip3 install --no-cache-dir --upgrade pip && \
    pip3 install poetry && \
    poetry config virtualenvs.create false

# export requirements.txt from poetry and install
# * Some module versions are adjusted directly for batch environments.
RUN poetry export -f requirements.txt -o requirements.studio.txt && \
    sed -e '/^h5py/d' requirements.studio.txt > requirements.batch.txt

RUN pip3 install -r requirements.studio.txt

# ----------------------------------------
# setup optinist batch environment #2
# ----------------------------------------

# Note: In this section, a batch-only conda environment is created
# with the privileges of a working user (optinist).

# Change to application user
USER optinist

# pip install to conda environment for batch processing
RUN . ~/.bashrc && \
    conda activate expdb_batch && \
    pip3 install --no-cache-dir --upgrade pip && \
    pip3 install -r requirements.batch.txt

# Return to root user
USER root

# copy cron scripts.
COPY --chown=optinist cron /app/cron

# ----------------------------------------
# setup optinist application environment #2
# ----------------------------------------

# setup optinist: download caiman model files
USER optinist
COPY studio/app/optinist/wrappers/caiman/run_download_model_files.sh ./
RUN bash run_download_model_files.sh && rm run_download_model_files.sh
USER root

# copy application sources.
COPY --chown=optinist frontend/build /app/frontend/build
COPY --chown=optinist studio /app/studio
COPY --chown=optinist sample_data /app/sample_data
COPY --chown=optinist main.py alembic.ini run_expdb_batch.py ./

# copy production-mode config files.
COPY --chown=optinist studio/config.production/ /app/studio/config/
RUN rm -rf /app/studio/config.production
