pipeline {
    agent any

    environment {
        // We define the IP here. 
        // Jenkins will inject this into the build command below.
        REACT_APP_API_URL = 'http://localhost:5000' 
    }

    stages {
        stage('Cleanup Old Containers') {
            steps {
                // "exit 0" tricks Windows into not crashing if the container doesn't exist yet
                bat 'docker stop ar-furniture-frontend ar-furniture-backend || exit 0'
                bat 'docker rm ar-furniture-frontend ar-furniture-backend || exit 0'
            }
        }
stage('Create Config') {
            steps {
                dir('server') {
                    // Create the .env file on the fly
                    // Replace the values with your actual secrets
                    bat 'echo PORT=5000 > .env'
                    bat 'echo MONGO_URI=mongodb+srv://admin:admin123@cluster0.k4rkrpb.mongodb.net/furnitureDB?appName=Cluster0 >> .env'
                    bat 'echo JWT_SECRET=super_secret_fyp_key_123 >> .env'
                    bat 'echo CLOUDINARY_CLOUD_NAME=dte2w6qyn >> .env'
                    bat 'echo CLOUDINARY_API_KEY=972641592611583 >> .env'
                    bat 'echo CLOUDINARY_API_SECRET=zf462igXCYZekotefH7dgkWxPds >> .env'
                }
            }
        }
        stage('Deploy Backend') {
            steps {
                dir('server') {
                    echo 'Building Backend...'
                    bat 'docker build -t ar-furniture-backend .'
                    
                    echo 'Running Backend...'
                    // Windows requires the .env file to be in the same folder
                    bat 'docker run -d -p 5000:5000 --env-file .env --name ar-furniture-backend ar-furniture-backend'
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                dir('client') {
                    echo 'Building Frontend...'
                    // We use Groovy string interpolation ${...} to pass the variable
                    bat "docker build --build-arg REACT_APP_API_URL=${REACT_APP_API_URL} -t ar-furniture-frontend ."
                    
                    echo 'Running Frontend...'
                    bat 'docker run -d -p 3000:80 --name ar-furniture-frontend ar-furniture-frontend'
                }
            }
        }
    }
}
