# The build-stage image, utilizing miniconda to set up 
# the virtual environment. 
FROM continuumio/miniconda3 AS build
# WORKDIR /app


# create conda env & install dependencies
# bring in the needed dependency files
COPY env_setup/environment.yml .

RUN conda env create -f environment.yml

SHELL ["/bin/bash", "-c" ]

RUN conda install -c conda-forge conda-pack
# standalone env in /venv (aranlp-env)
RUN conda-pack -n  alphagolite -o /tmp/env.tar && \
    mkdir /venv && \
    cd /venv && tar xf /tmp/env.tar && \
    rm /tmp/env.tar \
    /venv/bin/conda-unpack


FROM debian:buster


COPY --from=build /venv /venv 
WORKDIR /alphagolite
COPY . .

# activates virtual environment 
# https://pythonspeed.com/articles/activate-virtualenv-dockerfile/
ENV VIRTUAL_ENV=/venv
ENV PATH="$PATH:${VIRTUAL_ENV}/bin"



WORKDIR /alphagolite/play_go_web_app

RUN echo "source /venv/bin/activate" >> /root/.bashrc

RUN python3 manage.py makemigrations 
RUN python3 manage.py migrate 

ENTRYPOINT ["python3", "manage.py", "runserver", "0.0.0.0:8000"]
