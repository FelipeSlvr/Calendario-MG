import { Container, Row, Col, Card } from 'react-bootstrap'

const PHOTOS: Array<{ src?: string; title: string; caption: string }> = [
  {
    title: 'Role com a família',
    caption: 'Momentos na estrada e na resenha.',
  },
  {
    title: 'Cavalos de Aço MG',
    caption: 'União, respeito e parceria.',
  },
  {
    title: 'Paisagens do RS',
    caption: 'Por do sol, serra e bons destinos.',
  },
]

export default function GalleryPage() {
  return (
    <Container className="py-4">
      <Card className="homeCard">
        <Card.Body>
          <Card.Title className="text-white">Galeria</Card.Title>
          <Card.Text className="text-white-50">
            Em breve vamos publicar aqui as fotos dos nossos rolês e encontros.
          </Card.Text>

          <Row className="g-3 mt-2">
            {PHOTOS.map((p) => (
              <Col key={p.title} xs={12} md={4}>
                <Card className="bg-dark border border-danger h-100">
                  <div
                    style={{
                      height: 180,
                      background:
                        'linear-gradient(135deg, rgba(220,53,69,0.35), rgba(13,13,13,1))',
                      borderBottom: '1px solid rgba(220,53,69,0.35)',
                    }}
                    aria-label={p.title}
                    title={p.title}
                  />
                  <Card.Body>
                    <Card.Title className="text-white" style={{ fontSize: '1rem' }}>
                      {p.title}
                    </Card.Title>
                    <Card.Text className="text-white-50" style={{ fontSize: '0.9rem' }}>
                      {p.caption}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </Container>
  )
}
