# GreenTechSee2024

Team: Autility/Advanz

## 2D to 3D - 3D to BIM

This project aims to create a 3D ifc model from a 2D floor plan usin AI. The user should be able to upload a floorplan where openCv code will try and find all the floors, the user should then be able to press on any floors the AI model missed.

Then it should create a JSON file containing necessary data to build it in Bim viewer/clay made by That open Company.

In this viewer, user should be able to do certain actions on the building like: Delete walls, move walls, create new walls...

In the end, it should be possible to export as an ifc with all changes saved.

The code utilizes the openbim_clay repository made by ThatOpenCompany, to display walls.

## How to start working
The docker way: 
Run docker-compose up to get both backend and frontend up together. Then go to https://localhost:3000 to see the frontend.

Only FrontEnd: Run npm run pipe to start the cd pipeline for the frontend server
Only BackEnd: Run flask ...

Navigating to the frontend page will take you here:
![image](https://github.com/autility/GreenTechSee2024/assets/141043748/81419495-0352-481e-ad8e-e59f8153f39d)
Where you can upload the image for the floor detector. After that the backend will create your model and you are ready to edit!

