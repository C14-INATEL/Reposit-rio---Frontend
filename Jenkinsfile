pipeline {
    agent any

    tools {
        nodejs 'NodeJS-20'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Instalar dependencias') {
            steps {
                sh 'npm install'
            }
        }

        stage('Rodar testes') {
            steps {
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker build -t c214-frontend .'
                sh 'docker stop frontend || true'
                sh 'docker rm frontend || true'
                sh 'docker run -d --name frontend -p 5173:5173 c214-frontend'
            }
        }
    }

    post {
        success {
            echo 'Testes e deploy concluidos com sucesso!'
        }
        failure {
            echo 'Algum passo falhou. Verifique os logs acima.'
        }
    }
}