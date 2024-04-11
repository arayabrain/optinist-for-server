FROM --platform=linux/amd64 python:3.8.18-slim

WORKDIR /app

# ----------------------------------------
# install default packages
# ----------------------------------------

RUN apt-get --allow-releaseinfo-change update && \
    apt-get install --no-install-recommends -y sudo procps iproute2 iputils-ping less vim

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
# install packages
# ----------------------------------------

RUN mkdir -p /opt/miniconda3 && \
    apt-get install --no-install-recommends -y gcc g++ libgl1 libgl1-mesa-dev libopencv-dev wget && \
    wget -q https://repo.anaconda.com/miniconda/Miniconda3-py39_4.12.0-Linux-x86_64.sh -O /opt/miniconda3/miniconda.sh && \
    apt-get purge wget -y && apt-get autoremove -y && apt-get clean && \
    bash /opt/miniconda3/miniconda.sh -b -u -p /opt/miniconda3 && \
    rm /opt/miniconda3/miniconda.sh && \
    export PATH="$PATH:/opt/miniconda3/bin" && \
    conda upgrade -y --all && \
    conda config --set channel_priority strict && \
    conda clean -y --tarballs

ENV PATH $PATH:/opt/miniconda3/bin

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

USER optinist

# conda init
RUN /opt/miniconda3/bin/conda config --set channel_priority strict && \
    /opt/miniconda3/bin/conda init bash

# conda env create
COPY --chown=optinist studio/app/optinist/wrappers/caiman/conda/caiman.yaml /app/studio/conda_caiman.yaml
RUN . ~/.bashrc && \
#    conda create -n expdb_batch -y
    conda env create -n expdb_batch -f /app/studio/conda_caiman.yaml

# Return to root user
USER root

# ----------------------------------------
# setup optinist application environment
# ----------------------------------------

# pip install
# * copy only minimal files to enable docker run cache.
COPY --chown=optinist pyproject.toml ./
RUN pip3 install --no-cache-dir --upgrade pip && \
    pip3 install poetry && \
    poetry config virtualenvs.create false
RUN poetry install --no-root

# copy application sources.
COPY --chown=optinist frontend/build /app/frontend/build
COPY --chown=optinist studio /app/studio
COPY --chown=optinist main.py alembic.ini run_expdb_batch.py ./

# copy production-mode config files.
COPY --chown=optinist studio/config.production/ /app/studio/config/
RUN rm -rf /app/studio/config.production

# ----------------------------------------
# setup optinist batch environment #2
# ----------------------------------------

# Note: In this section, a batch-only conda environment is created
# with the privileges of a working user (optinist).

USER optinist

# pip install to conda environment for batch processing
RUN . ~/.bashrc && \
    conda activate expdb_batch && \
    pip3 install --no-cache-dir --upgrade pip && \
    pip3 install poetry && \
    poetry config virtualenvs.create false && \
    poetry install --no-root

# Return to root user
USER root

# copy cron scripts.
COPY --chown=optinist cron /app/cron

EXPOSE 8000
