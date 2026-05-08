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

        stage('Instalar dependências') {
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
    }

    post {
        success {
            echo '✅ Testes e build passaram com sucesso!'
        }
        failure {
            echo '❌ Algo falhou. Verifique os logs acima.'
        }
    }
}