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

        stage('Relatório de Testes Frontend - Guilherme') {
            steps {
                sh 'mkdir -p test-results'

                // Executa os testes e gera JUnit XML
                sh 'npm run test:ci'

                // Gera relatório HTML
                sh 'npm run test:report'
            }

            post {
                always {

                    // Publica os resultados dos testes no Jenkins
                    junit allowEmptyResults: true,
                          testResults: 'test-results/junit.xml'

                    // Salva os relatórios como artefatos
                    archiveArtifacts artifacts: 'test-results/**',
                                     allowEmptyArchive: true

                    // Envio de e-mail
                    emailext(
                        subject: "[Duck Frontend] Testes - Build #${env.BUILD_NUMBER} - ${currentBuild.currentResult}",
                        mimeType: 'text/html',
                        body: """
                            <h2>Relatório de Testes — Duck Frontend</h2>

                            <p><b>Build:</b> #${env.BUILD_NUMBER}</p>
                            <p><b>Status:</b> ${currentBuild.currentResult}</p>
                            <p><b>Projeto:</b> ${env.JOB_NAME}</p>
                            <p><b>Branch:</b> ${env.GIT_BRANCH ?: 'main'}</p>

                            <hr>

                            <p>
                                Os relatórios de testes foram anexados a este e-mail.
                            </p>

                            <p>
                                Build URL:
                                <a href="${env.BUILD_URL}">
                                    ${env.BUILD_URL}
                                </a>
                            </p>
                        """,
                        attachmentsPattern: 'test-results/index.html,test-results/junit.xml',
                        to: 'guilhermefribeiro41@gmail.com'
                    )
                }
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