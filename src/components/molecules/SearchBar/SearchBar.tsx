import { Button } from "../../atoms/Button/Button";
import { Icon } from "../../atoms/Icon/Icon";
import { Input } from "../../atoms/Input/Input";
import { Separator } from "../../atoms/Separator/Separator";
export const SearchBar = () => (
  <div className="col-auto ms-auto d-flex align-items-center">
    <Input variant="search" placeholder="Buscar..." />
    <Separator variant="vertical"></Separator>
    <Button variant="light" >
      <Icon variant="search" size="sm" />
    </Button>
  </div>
);