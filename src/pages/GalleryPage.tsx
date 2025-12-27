import { useMemo, useState } from 'react'
import { Accordion, Col, Container, Modal, Row } from 'react-bootstrap'
import { GALLERY_ENTRIES, type GalleryGeneratedEntry, type GalleryGeneratedPhoto } from '../data/gallery.generated'

type OpenState = { entry: GalleryGeneratedEntry; photo: GalleryGeneratedPhoto } | null

export default function GalleryPage() {
  const [open, setOpen] = useState<OpenState>(null)

  const baseUrl = import.meta.env.BASE_URL

  const entries = useMemo(() => {
    return GALLERY_ENTRIES
  }, [])

  const resolveSrc = (src: string) => {
    // Se for URL absoluta, usa direto
    if (/^https?:\/\//i.test(src)) return src
    // Se for relativo, prefixa com BASE_URL (resolve deploy em subpath tipo /Calendario-mg/)
    const clean = src.replace(/^\/+/, '')
    return `${baseUrl}${clean}`
  }

  return (
    <Container className="py-4">
      <div className="calendarCard">
        <div className="p-3">
          <div className="agendaTitle text-white">Galeria</div>
          <div className="text-white-50" style={{ marginTop: 6, fontSize: 13 }}>
            Organize por data e local, com miniaturas que abrem em tela cheia.
          </div>

          <div style={{ marginTop: 12 }}>
            <Accordion defaultActiveKey="0" alwaysOpen className="galleryAccordion">
              {entries.length === 0 ? (
                <div className="text-white-50" style={{ padding: 12 }}>
                  Nenhuma pasta encontrada em <code>public/galeria</code>.
                  <br />
                  Crie uma pasta tipo <b>"Candelaria - 20-12-2025"</b> e coloque as fotos dentro.
                </div>
              ) : null}

              {entries.map((e, idx) => (
              <Accordion.Item eventKey={String(idx)} key={e.id}>
                <Accordion.Header>
                  {e.date ? new Date(`${e.date}T00:00:00`).toLocaleDateString('pt-BR') : 'Sem data'} — {e.place}
                </Accordion.Header>
                <Accordion.Body>
                  <Row className="g-3">
                    {e.photos.map((p) => (
                      <Col key={p.id} xs={6} sm={4} md={3} lg={2}>
                        <button
                          type="button"
                          className="galleryThumb"
                          onClick={() => setOpen({ entry: e, photo: p })}
                          title={p.title}
                        >
                          <img src={resolveSrc(p.src)} alt={p.title} loading="lazy" />
                        </button>
                      </Col>
                    ))}
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
              ))}
            </Accordion>
          </div>
        </div>
      </div>

      <Modal
        show={!!open}
        onHide={() => setOpen(null)}
        centered
        size="lg"
        contentClassName="bg-dark text-white"
      >
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title style={{ fontSize: '1rem' }}>
            {open
              ? `${open.entry.date ? new Date(`${open.entry.date}T00:00:00`).toLocaleDateString('pt-BR') : 'Sem data'} — ${open.entry.place}`
              : ''}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {open ? (
            <>
              <div className="d-flex justify-content-center">
                <img
                  src={resolveSrc(open.photo.src)}
                  alt={open.photo.title}
                  style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
                />
              </div>
              <div className="text-white-50 mt-3" style={{ fontSize: '0.95rem' }}>
                {open.photo.title}
              </div>
            </>
          ) : null}
        </Modal.Body>
      </Modal>
    </Container>
  )
}
