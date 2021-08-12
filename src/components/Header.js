import Button from "./Button"
import { useLocation } from "react-router-dom"


const Header = ({ title, onClick, color, text }) => {
    const location = useLocation()

    return (
        <header className="header">
            <h1> {title} </h1>
            {location.pathname === "/" && <Button color={color} text={text} onClick={onClick} />}
        </header>
    )
}

export default Header
