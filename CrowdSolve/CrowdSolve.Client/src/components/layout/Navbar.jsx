import CrowdSolveLogo from '@/assets/CrowdSolveLogo.svg';
import { HamburgerMenuIcon } from "@radix-ui/react-icons"
import { Button } from "@/components/ui/button"

const Navbar = () => {
    return (
        <nav className="relative flex w-full flex-wrap items-center justify-between py-2 lg:py-4">
            <div className="flex w-full flex-wrap items-center justify-between px-3">
                <div>
                    <a className="mx-2 my-1 flex items-center lg:mb-0 lg:mt-0" href="#">
                        <img className="me-2" src={CrowdSolveLogo} style={{ height: '50px' }} alt="CrowdSolve Logo" />
                    </a>
                </div>
                <Button variant="outline" size="icon" className="flex md:hidden">
                    <HamburgerMenuIcon className="h-4 w-4" />
                </Button>
                <div className="hidden md:flex flex-grow items-center justify-end">
                    <a className="mx-2 my-1" href="#">Sobre nosotros</a>
                    <a className="mx-2 my-1" href="#">Desafíos</a>
                    <a className="mx-2 my-1" href="#">Empresas</a>

                    <Button className="mx-2 my-1"  variant="secondary">Iniciar sesión</Button>
                    <Button className="mx-2 my-1">Registrarse</Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;