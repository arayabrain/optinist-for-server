FROM --platform=linux/amd64 python:3.8.16-slim

WORKDIR /app

RUN mkdir -p /root/miniconda3 && \
    apt-get --allow-releaseinfo-change update && \
    apt-get install --no-install-recommends -y gcc g++ libgl1 libgl1-mesa-dev libopencv-dev && \
    apt-get install --no-install-recommends -y procps iproute2 less vim && \
    apt-get install --no-install-recommends -y wget && \
    wget -q https://repo.anaconda.com/miniconda/Miniconda3-py39_4.12.0-Linux-x86_64.sh -O ~/miniconda3/miniconda.sh && \
    apt-get purge wget -y && apt-get autoremove -y && apt-get clean && \
    bash /root/miniconda3/miniconda.sh -b -u -p /root/miniconda3 && \
    rm /root/miniconda3/miniconda.sh && \
    export PATH="$PATH:/root/miniconda3/bin" && \
    conda upgrade -y --all && \
    conda config --set channel_priority strict && \
    conda clean -y --tarballs

ENV PATH $PATH:/root/miniconda3/bin

COPY frontend/build /app/frontend/build
COPY studio /app/studio
COPY main.py pyproject.toml alembic.ini run_expdb_batch.py ./

# copy production-mode config files.
COPY studio/config.production/ /app/studio/config/
RUN rm -rf /app/studio/config.production

RUN pip3 install --no-cache-dir --upgrade pip && \
    pip3 install --no-cache-dir -e .

# for cron settings.
RUN ln -snf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime && echo "Asia/Tokyo" > /etc/timezone
RUN apt-get install --no-install-recommends -y cron rsyslog
RUN echo "cron.*  /var/log/cron.log" > /etc/rsyslog.d/50-default.conf
RUN echo 'service rsyslog start\n\
service cron start' >> ./init_docker_services.sh

# set cron script
# - TODO: At the time of release, the setting will default to commented out. (manual activation)
#   -> After confirming stable operation of the system, enable will be the default.
RUN echo '# */5 * * * * root cd /app; /usr/local/bin/python run_expdb_batch.py -o 1 > /dev/null 2>&1' > /etc/cron.d/optinist-svr-expdb-batch

RUN echo 'alias ll="ls -la --color=auto"' >> ~/.bashrc
RUN echo 'set nu ic hls nowrap ts=4 sw=4 | syntax on' >> ~/.vimrc

EXPOSE 8000
