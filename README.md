# Project
### techs :
- backend (server)
  - express js
- db
  - mongoDB
- frontend (front)
  - tbd

## Summary
Library of different Roleplay Tabletop Game 'objects'. 
Users can access 'public' objects, made by other users, and create their own, public or private.
Admins can additionaly see a list of all users.

## start 
in ./server :
> docker compose up
(on first init only. Start the container otherwise)
> npm start
in ./front :
> npm run dev

## Security
### dev
Sonarqube tests are not automatically run on commit or push. Indeed, sonarqube-scanner has been installed on  front and server sides, but the github repo encompasses both. If I have more time, a later solution will run both parts as I push. For now, one need to manually run the test with the following command (from root) :
sonar-scanner \
  -Dsonar.projectKey=my-sonarqube-project-name \
  -Dsonar.sources=front/. \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=YOUR_GENERATED_TOKEN
and
sonar-scanner \
  -Dsonar.projectKey=my-sonarqube-project-name \
  -Dsonar.sources=server/. \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=YOUR_GENERATED_TOKEN

### Create new admin
new admins can only be created using postman or a shell. No frontend allows it.

## BDD
make sure the container and volumes are not already existing when building, or it won't be able to generate properly.
> docker compose up
On server launch, we create an admin if the count of total admins is null. 
The credentials are defined in server/.env, and are by default :
BOOTSTRAP_ADMIN_EMAIL="Manel@BENHAMOUDA.test"
BOOTSTRAP_ADMIN_PASSWORD="Password1234!"
BOOTSTRAP_ADMIN_USERNAME="Manel BENHAMOUDA" // not necessary

## confidentialité :
Votre historique de connection (date et heure) est conservée, pour des raisons de sécurité.
Toutes les données EXCEPTE le mot de passe utilisateur décrypté sont consultable par un admin a tout moment.