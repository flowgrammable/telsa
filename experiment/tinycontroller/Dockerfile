FROM ubuntu:14.04

RUN sudo apt-get update -y 
RUN sudo apt-get install nodejs -y
RUN sudo apt-get install npm -y
COPY . / 
RUN npm install
EXPOSE 6640
CMD ["nodejs"] 
