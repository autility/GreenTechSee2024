FROM python:latest

RUN apt update
RUN apt -y upgrade
# RUN apt install -y gcc
# RUN apt install -y python3-shapely

WORKDIR /backend


ENV GEOS http://download.osgeo.org/geos/geos-3.12.1.tar.bz2
WORKDIR /backend/geos
# ADD $GEOS /geos/geos.tar.bz2
RUN wget $GEOS -o goes.tar.bz2
RUN tar xf /backend/geos/geos.tar.bz2 -C /backend/geos/geos --strip-components=1
RUN ./configure && make -J 1 && make install
RUN ldconfig


WORKDIR /backend
COPY . /backend


RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt
EXPOSE 8080

CMD ["./backend.py"]