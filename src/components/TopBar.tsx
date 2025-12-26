import { Button, Container, Navbar } from 'react-bootstrap'

type Props = {
  title: string
  subtitle: string
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  placement?: 'top' | 'bottom'
}

export function TopBar({ title, subtitle, onPrev, onNext, onToday, placement = 'top' }: Props) {
  return (
    <Navbar className={`topBar ${placement === 'bottom' ? 'topBarBottom' : 'topBarTop'}`} expand={false}>
      <Container fluid className="px-3">
        <div className="d-flex align-items-center gap-2">
          <Button variant="outline-light" size="sm" onClick={onPrev}>
            ◀
          </Button>
          <Button variant="outline-light" size="sm" onClick={onNext}>
            ▶
          </Button>
          <Button variant="outline-light" size="sm" onClick={onToday}>
            Hoje
          </Button>
        </div>

        <div className="topBarCenter">
          <div className="topBarTitle">{title}</div>
          <div className="topBarSubtitle">{subtitle}</div>
        </div>

        <div className="brandMark">Cavalos de Aço MG</div>
      </Container>
    </Navbar>
  )
}
