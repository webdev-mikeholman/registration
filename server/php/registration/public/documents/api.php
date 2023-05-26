<?php
require("../../vendor/autoload.php");

$openapi = \OpenApi\Generator::scan(['../../controller']);

header('Content-Type: application/json');
echo $openapi->toJSON();