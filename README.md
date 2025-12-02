# Project
### techs :
- backend (server)
  - express js
- db
  - mongoDB
- frontend (front)
  - tbd

## Summary
Library of different Roleplay Tabletop Game 'objects'. Users can access 'public' objects, made by other users, and create their own, public or private.

### Functions :
  - Admin : 
    - create new objects
    - see users
  - Users :
    - rent objects
    optional : create a character ?

## Security
### dev
Sonarqube tests are not automatically run on commit or push. Indeed, sonarqube-scanner has been installed on  front and server sides, but the github repo encompasses both. If I have more time, a later solution will run both parts as I push. For now, one need to manually run the test with the following command :
sonar-scanner \
  -Dsonar.projectKey=my-sonarqube-project-name \
  -Dsonar.sources= front/. \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=YOUR_GENERATED_TOKEN
and
sonar-scanner \
  -Dsonar.projectKey=my-sonarqube-project-name \
  -Dsonar.sources= server/. \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=YOUR_GENERATED_TOKEN

## BDD
make sure the container and volumes are not already existing when building, or it won't be able to generate properly.

## confidentialité :
Votre historique de connection (date et heure) est conservée, pour des raisons de sécurité.
Toutes les données EXCEPTE le mot de passe utilisateur décrypté sont consultable par un admin a tout moment.