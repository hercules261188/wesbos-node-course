import "../sass/style.scss";

import { $, $$ } from "./modules/bling";
import autocomplete from "./modules/autocomplete";
import typeAhead from "./modules/typeAhead";

// Google requires payment for that, f*** them
// autocomplete($("#address"), $("#lat"), $("#lng"));

typeAhead($(".search"));
