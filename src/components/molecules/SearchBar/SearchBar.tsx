import { Button } from "../../atoms/Button/Button";
import { Icon } from "../../atoms/Icon/Icon";
import { Input } from "../../atoms/Input/Input";
export const SearchBar = () => (
  <div className="d-flex">
    <Input variant="search" placeholder="Buscar..." />
    <div>
    <Button variant="light" >
                  <Icon variant="search" size="sm" />
                </Button>
  </div>
  </div>
);