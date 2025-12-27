import { Card, Col, Container, Row } from 'react-bootstrap'

export function HomePage() {
  return (
    <Container className="py-4">
      <Row className="g-4">
        <Col lg={10} xl={8} className="mx-auto">
          <Card className="glassCard">
            <Card.Body className="homeAbout">
              <div className="homeAboutText">
                <h1 className="heroTitle heroTitleWhite">Quem somos</h1>

                <p className="heroText heroTextWhite">
                  Somos um grupo de amigos do Rio Grande do Sul, da região metropolitana de Porto Alegre, que gosta de
                  pegar a estrada por prazer — e também como terapia. Pra gente, a moto é liberdade: é parceria,
                  roteiro simples e histórias boas na volta.
                </p>

                <p className="heroText heroTextWhite">
                  Fazemos de tudo um pouco: bate-voltas no fim de semana, viagens com camping e paradas estratégicas,
                  sempre buscando paisagens bonitas (serra, lago, litoral e aquele pôr do sol na estrada). O foco é
                  curtir e respeitar o ritmo de cada um.
                </p>

                <p className="heroText heroTextWhite mb-0">
                  Nosso estilo de moto é, em sua maioria, custom: Harley-Davidson, Royal Enfield, Triumph e Suzuki —
                  mas o que manda mesmo é a parceria. Se encaixa no rolê quem curte estrada, amizade e boas paisagens.
                </p>
              </div>

              <div className="homeAboutMedia">
                <img
                  className="homePhoto"
                  src={`${import.meta.env.BASE_URL}nos.jpeg`}
                  alt="Cavalos de Aço MG"
                  loading="lazy"
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
