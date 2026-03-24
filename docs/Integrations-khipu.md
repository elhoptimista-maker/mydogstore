# API Pagos Instantáneos

La API Instant Payment de Khipu (versión 3.0) permite a comerciantes iniciar, consultar, confirmar,  reembolsar o eliminar pagos inmediatos mediante transferencias bancarias en tiempo real.  Entre sus principales funcionalidades se encuentran: obtener la lista de bancos disponibles  con detalles como límites, tarifas y logos; crear un pago especificando un banco o dejar que el  usuario elija; confirmar o solicitar el reembolso de un pago mediante su ID; y predecir el estado  de un pago usando machine learning. Esta API maneja autenticación mediante clave secreta en el  encabezado x-api-key, no requiere firmas, y utiliza certificados SSL de validación extendida para  asegurar la comunicación

Version: v3.0
License: API Pagos Instantáneos

## Servers

Producción
```
https://payment-api.khipu.com
```

## Security

### Api-Key

Type: apiKey
In: header
Name: x-api-key

## Download OpenAPI description

[API Pagos Instantáneos](https://docs.khipu.com/_bundle/apis/v3/instant-payments/openapi.yaml)

## Other

### Get banks

 - [GET /v3/banks](https://docs.khipu.com/apis/v3/instant-payments/openapi/other/getbanks.md): Este método obtiene la lista de bancos que se pueden utilizar para pagar en esta cuenta de cobro.

### Confirm payment by Id

 - [POST /v3/payments/{id}/confirm](https://docs.khipu.com/apis/v3/instant-payments/openapi/other/postpaymentconfirmbyid.md): Advertencia: Esta función sólo está disponible para los clientes que la hayan contratado de forma independiente.
Para utilizarla, póngase en contacto con nosotros en soporte@khipu.com
Confirmar el pago. Al confirmar el pago, este será rendido al día hábil
siguiente.

### Get payment by Id

 - [GET /v3/payments/{id}](https://docs.khipu.com/apis/v3/instant-payments/openapi/other/getpaymentbyid.md): Información completa del pago. Datos con los que fue creado y el estado actual del pago.

### Delete payment by Id

 - [DELETE /v3/payments/{id}](https://docs.khipu.com/apis/v3/instant-payments/openapi/other/deletepaymentbyid.md): Borrar un pago. Solo se pueden borrar pagos que estén pendientes de pagar. Esta operación no puede deshacerse.

### Create payment

 - [POST /v3/payments](https://docs.khipu.com/apis/v3/instant-payments/openapi/other/postpayment.md): Crea un pago en Khipu y obtiene las URLs para redirección al usuario para que complete el pago.

### Refund payment by Id

 - [POST /v3/payments/{id}/refunds](https://docs.khipu.com/apis/v3/instant-payments/openapi/other/postpaymentrefundsbyid.md): Reembolsa total o parcialmente el monto de un pago. Esta operación solo se puede realizar en los comercios que recauden en cuenta Khipu y antes de la rendición de los fondos correspondientes.

### Get payment prediction

 - [GET /v3/predict](https://docs.khipu.com/apis/v3/instant-payments/openapi/other/getpredict.md): Predicción acerca del resultado de un pago, si podrá o no funcionar. Información adicional como máximo posible de transferir a un nuevo destinatario.

### Post receiver

 - [POST /v3/receivers](https://docs.khipu.com/apis/v3/instant-payments/openapi/other/postreceiver.md): Advertencia: Esta función sólo está disponible para los clientes que la hayan contratado de forma independiente.
Para utilizarla, póngase en contacto con nosotros en soporte@khipu.com
Crear una nueva cuenta de cobro asociada a un integrador. Necesita datos
de la cuenta de usuario asociada, datos de facturación y datos de contacto.

### Get receivers

 - [GET /v3/receivers/children](https://docs.khipu.com/apis/v3/instant-payments/openapi/other/getreceivers.md): Advertencia: Esta función sólo está disponible para los clientes que la hayan contratado de forma independiente.
Para utilizarla, póngase en contacto con nosotros en soporte@khipu.com
Obtener la lista de cuentas de cobro asociadas a un integrador.

### Get payment methods

 - [GET /v3/merchants/{id}/paymentMethods](https://docs.khipu.com/apis/v3/instant-payments/openapi/other/getmerchantpaymentmethodsbyid.md): Obtiene el listado de medios de pago disponible para una cuenta de cobrador.

# Get banks

Este método obtiene la lista de bancos que se pueden utilizar para pagar en esta cuenta de cobro.

Endpoint: GET /v3/banks
Version: v3.0
Security: Api-Key

## Response 200 fields (application/json):

  - `banks` (array, required)
    Arreglo con listado de bancos.

  - `banks.bank_id` (string, required)
    Identificador del banco.
    Example: "SDdGj"

  - `banks.name` (string, required)
    Nombre del banco.
    Example: "Banco Estado"

  - `banks.message` (string, required)
    Mensaje con particularidades del banco.
    Example: "Tarifa de $300 de transferencia a otros bancos, usando CuentaRUT."

  - `banks.min_amount` (number, required)
    Monto mínimo que acepta el banco en un pago.
    Example: 1000

  - `banks.type` (string, required)
    Tipo de banco.
    Enum: "Persona", "Empresa"

  - `banks.parent` (string, required)
    Identificador del banco padre (si un banco tiene banca personas y empresas, el primero será el padre del segundo).

  - `banks.logo_url` (string)
    URL del logo del banco.
    Example: "https://s3.amazonaws.com/static.khipu.com/logos/bancos/chile/estado-icon.png"


## Response 400 fields

## Response 401 fields

## Response 403 fields

## Response 404 fields

## Response 500 fields

# Confirm payment by Id

Advertencia: Esta función sólo está disponible para los clientes que la hayan contratado de forma independiente.
Para utilizarla, póngase en contacto con nosotros en soporte@khipu.com
Confirmar el pago. Al confirmar el pago, este será rendido al día hábil
siguiente.

Endpoint: POST /v3/payments/{id}/confirm
Version: v3.0
Security: Api-Key

## Path parameters:

  - `id` (string, required)
    Identificador del pago

## Response 200 fields (application/json):

  - `message` (string, required)
    Mensaje a desplegar al usuario.
    Example: "Message."


## Response 400 fields

## Response 401 fields

## Response 403 fields

## Response 404 fields

## Response 500 fields

# Get payment by Id

Información completa del pago. Datos con los que fue creado y el estado actual del pago.

Endpoint: GET /v3/payments/{id}
Version: v3.0
Security: Api-Key

## Path parameters:

  - `id` (string, required)
    Identificador del pago

## Response 200 fields (application/json):

  - `payment_id` (string, required)
    Identificador único del pago, es una cadena alfanumérica de 12 caracteres. Como este identificador es único, se puede usar, por ejemplo, para evitar procesar una notificación repetida. (Khipu espera un código 200 al notificar un pago, si esto no ocurre se reintenta hasta por dos días).
    Example: "gqzdy6chjne9"

  - `payment_url` (string, required)
    URL principal del pago, si el usuario no ha elegido previamente un método de pago se le muestran las opciones.
    Example: "https://khipu.com/payment/info/gqzdy6chjne9"

  - `simplified_transfer_url` (string, required)
    URL de pago simplificado.
    Example: "https://app.khipu.com/payment/simplified/gqzdy6chjne9"

  - `transfer_url` (string, required)
    URL de pago normal.
    Example: "https://khipu.com/payment/manual/gqzdy6chjne9"

  - `app_url` (string, required)
    URL para invocar el pago desde un dispositivo móvil usando la APP de Khipu.
    Example: "khipu:///pos/gqzdy6chjne9"

  - `ready_for_terminal` (boolean, required)
    Es true si el pago ya cuenta con todos los datos necesarios para abrir directamente la aplicación de pagos Khipu.

  - `notification_token` (string, required)
    Cadena de caracteres alfanuméricos que identifican unicamente al pago, es el identificador que el servidor de Khipu enviará al servidor del comercio cuando notifique que un pago está conciliado.
    Example: "9dec8aa176c5223026919b3b5579a4776923e646ff3be686b9e6b62ec042e91f"

  - `receiver_id` (integer, required)
    Identificador único de una cuenta de cobro.
    Example: 985101

  - `conciliation_date` (string, required)
    Fecha y hora de conciliación del pago. Formato ISO-8601.
    Example: "2017-03-01T13:00:00.000Z"

  - `subject` (string, required)
    Motivo del pago.
    Example: "Test"

  - `amount` (number, required)
    El monto del cobro.
    Example: 1000

  - `currency` (string, required)
    El código de moneda en formato ISO-4217.
    Example: "CLP"

  - `status` (string, required)
    Estado del pago, puede ser pending (el pagador aún no comienza a pagar), verifying (se está verificando el pago) o done, cuando el pago ya está confirmado.
    Enum: "pending", "verifying", "done"

  - `status_detail` (string, required)
    Detalle del estado del pago:
pending (el pagador aún no comienza a pagar),
normal (el pago fue verificado y fue cancelado por algún medio de pago estándar),
marked-paid-by-receiver (el cobrador marcó el cobro como pagado por otro medio),
rejected-by-payer (el pagador declaró que no pagará),
marked-as-abuse (el pagador declaró que no pagará y que el cobro fue no solicitado), y
reversed (el pago fue anulado por el comercio, el dinero fue devuelto al pagador).
    Enum: "pending", "normal", "marked-paid-by-receiver", "rejected-by-payer", "marked-as-abuse", "reversed"

  - `body` (string, required)
    Detalle del cobro.
    Example: "Test"

  - `picture_url` (string, required)
    URL con imagen del cobro.
    Example: "https://micomercio.com/picture_url"

  - `receipt_url` (string, required)
    URL del comprobante de pago.
    Example: "https://micomercio.com/order/receipt_url"

  - `return_url` (string, required)
    URL donde se redirige al pagador luego que termina el pago.
    Example: "https://micomercio.com/order/return_url"

  - `cancel_url` (string, required)
    URL donde se redirige al pagador luego de que desiste hacer el pago.
    Example: "https://micomercio.com/order/cancel_url"

  - `notify_url` (string, required)
    URL del webservice donde se notificará el pago.
    Example: "https://micomercio.com/webhook/notify_url"

  - `notify_api_version` (string, required)
    Versión de la API de notificación.
    Example: "3.0"

  - `expires_date` (string, required)
    Fecha máxima para ejecutar el pago (en formato ISO-8601). El cliente podrá realizar varios intentos de pago hasta dicha fecha. Cada intento tiene un plazo individual de 3 horas para su ejecución.
    Example: "2023-12-31T15:45:00-04:00"

  - `attachment_urls` (array, required)
    Arreglo de URLs de archivos adjuntos al pago.
    Example: ["https://micomercio.com/attachment1.pdf"]

  - `bank` (string, required)
    Nombre del banco seleccionado por el pagador.
    Example: "Banco de Chile (Edwards Citi)"

  - `bank_id` (string, required)
    Identificador del banco seleccionado por el pagador.
    Example: "dfFbF"

  - `payer_name` (string, required)
    Nombre del pagador.
    Example: "Nombre Pagador"

  - `payer_email` (string, required)
    Correo electrónico del pagador.
    Example: "pagador@email.com"

  - `personal_identifier` (string, required)
    Identificador personal del pagador.
    Example: "11.000.111-9"

  - `bank_account_number` (string, required)
    Número de cuenta bancaria del pagador.
    Example: "001120490689"

  - `out_of_date_conciliation` (boolean, required)
    Es true si la conciliación del pago fue hecha luego de la fecha de expiración.
    Example: true

  - `transaction_id` (string, required)
    Identificador del pago asignado por el cobrador.
    Example: "zwo3wqz6uulcvajt"

  - `custom` (string, required)
    Campo genérico que asigna el cobrador al momento de hacer el pago.
    Example: "<xml>...</xml>"

  - `responsible_user_email` (string, required)
    Correo electrónico de la persona responsable del pago.
    Example: "responsible@email.com"

  - `send_reminders` (boolean, required)
    Es true cuando este es un cobro por correo electrónico y Khipu enviará recordatorios.
    Example: true

  - `send_email` (boolean, required)
    Es true cuando Khipu enviará el cobro por correo electrónico.
    Example: true

  - `payment_method` (string, required)
    Método de pago usado por el pagador, puede ser regular_transfer (transferencia normal) o simplified_transfer (transferencia simplificada).
    Enum: "regular_transfer", "simplified_transfer", "not_available"

  - `funds_source` (string, required)
    Origen de fondos usado por el pagador, puede ser debit para pago con débito, prepaid para pago con prepago, credit para pago con crédito, o vacío en el caso de que se haya pagado mediante transferencia bancaria.
    Enum: "debit", "prepaid", "credit", "not-available", ""

  - `discount` (number)
    Monto a descontar del valor pagado.

  - `third_party_authorization_details` (string)
    Ignorar este campo.


## Response 400 fields

## Response 401 fields

## Response 403 fields

## Response 404 fields

## Response 500 fields

# Delete payment by Id

Borrar un pago. Solo se pueden borrar pagos que estén pendientes de pagar. Esta operación no puede deshacerse.

Endpoint: DELETE /v3/payments/{id}
Version: v3.0
Security: Api-Key

## Path parameters:

  - `id` (string, required)
    Identificador del pago

## Response 200 fields (application/json):

  - `message` (string, required)
    Mensaje a desplegar al usuario.
    Example: "Message."


## Response 400 fields

## Response 401 fields

## Response 403 fields

## Response 404 fields

## Response 500 fields

# Create payment

Crea un pago en Khipu y obtiene las URLs para redirección al usuario para que complete el pago.

Endpoint: POST /v3/payments
Version: v3.0
Security: Api-Key

## Request fields (application/json):

  - `amount` (number, required)
    El monto del cobro. Sin separador de miles y usando '.' como separador de decimales. Hasta 4 lugares decimales, dependiendo de la moneda.
    Example: 1000

  - `currency` (string, required)
    El código de moneda en formato ISO-4217.
    Enum: "CLP", "CLF", "ARS", "PEN", "MXN", "USD", "EUR", "BOB", "COP"

  - `subject` (string, required)
    Motivo.
    Example: "Cobro de prueba"

  - `transaction_id` (string)
    Identificador propio de la transacción. Ej: número de factura u orden de compra.
    Example: "zwo3wqz6uulcvajt"

  - `custom` (string)
    Parámetro para enviar información personalizada de la transacción. Ej: documento XML con el detalle del carro de compra.
    Example: "<xml>...</xml>"

  - `body` (string)
    Descripción del cobro.
    Example: "Cobro de orden de compra #123-abcdef"

  - `bank_id` (string)
    Identificador del banco para usar en el pago.
    Example: "SDdGj"

  - `return_url` (string)
    La dirección URL a donde enviar al cliente mientras el pago está siendo verificado.
    Example: "https://micomercio.com/order/return_url"

  - `cancel_url` (string)
    La dirección URL a donde enviar al cliente si decide no hacer hacer la transacción.
    Example: "https://micomercio.com/order/cancel_url"

  - `picture_url` (string)
    Una dirección URL de una foto de tu producto o servicio.
    Example: "https://micomercio.com/picture_url"

  - `notify_url` (string)
    La dirección del web-service que utilizará khipu para notificar cuando el pago esté conciliado.
    Example: "https://micomercio.com/webhook/notify_url"

  - `contract_url` (string)
    La dirección URL del archivo PDF con el contrato a firmar mediante este pago. El cobrador debe estar habilitado para este servicio y el campo fixed_payer_personal_identifier es obligatorio.
    Example: "https://micomercio.com/contract_url"

  - `notify_api_version` (string)
    Versión de la API de notificaciones para recibir avisos por web-service.
    Example: "3.0"

  - `expires_date` (string)
    Fecha máxima para ejecutar el pago (en formato ISO-8601). El cliente podrá realizar varios intentos de pago hasta dicha fecha. Cada intento tiene un plazo individual de 3 horas para su ejecución.
    Example: "2023-12-31T15:45:00-04:00"

  - `send_email` (boolean)
    Si es true, se enviará una solicitud de cobro al correo especificado en payer_email.

  - `payer_name` (string)
    Nombre del pagador. Es obligatorio cuando send_email es true.
    Example: "Nombre Pagador"

  - `payer_email` (string)
    Correo del pagador. Es obligatorio cuando send_email es true.
    Example: "pagador@email.com"

  - `send_reminders` (boolean)
    Si es true, se enviarán recordatorios de cobro.
    Example: true

  - `responsible_user_email` (string)
    Correo electrónico del responsable de este cobro, debe corresponder a un usuario Khipu con permisos para cobrar usando esta cuenta de cobro.
    Example: "responsible@email.com"

  - `fixed_payer_personal_identifier` (string)
    Identificador personal. Si se especifica, solo podrá ser pagado usando ese identificador.
    Example: "11.000.111-9"

  - `integrator_fee` (string)
    Comisión para el integrador. Sólo es válido si la cuenta de cobro tiene una cuenta de integrador asociada.
    Example: "100"

  - `collect_account_uuid` (string)
    Para cuentas de cobro con más cuenta propia. Permite elegir la cuenta donde debe ocurrir la transferencia.
    Example: "007367340234"

  - `confirm_timeout_date` (string)
    Fecha de rendición del cobro. Es también la fecha final para poder reembolsar el cobro. Formato ISO-8601.
    Example: "2017-03-01T13:00:00Z"

  - `mandatory_payment_method` (string)
    El cobro sólo se podrá pagar utilizando el medio de pago especificado. Los posibles valores para este campo se encuentran en el campo id de la respuesta del endpoint /api/3.0/merchants/paymentMethods.
    Example: "simplified_transfer"

  - `psp_client_merchant_name` (string)
    Nombre del comercio final para quien un proveedor de servicios de pago procesa un pago. Requerido para transacciones de clientes PSP; no aplicable para otros. En caso de tratarse de un PSP de PSP, estos deben ingresarse separados por '->'.
    Example: "PSP 1->PSP 2->Client Name"

## Response 200 fields (application/json):

  - `payment_id` (string, required)
    Identificador único del pago, es una cadena alfanumérica de 12 caracteres. Como este identificador es único, se puede usar, por ejemplo, para evitar procesar una notificación repetida. (Khipu espera un código 200 al notificar un pago, si esto no ocurre se reintenta hasta por dos días).
    Example: "gqzdy6chjne9"

  - `payment_url` (string, required)
    URL principal del pago, si el usuario no ha elegido previamente un método de pago se le muestran las opciones.
    Example: "https://khipu.com/payment/info/gqzdy6chjne9"

  - `simplified_transfer_url` (string, required)
    URL de pago simplificado.
    Example: "https://app.khipu.com/payment/simplified/gqzdy6chjne9"

  - `transfer_url` (string, required)
    URL de pago normal.
    Example: "https://khipu.com/payment/manual/gqzdy6chjne9"

  - `app_url` (string, required)
    URL para invocar el pago desde un dispositivo móvil usando la APP de Khipu.
    Example: "khipu:///pos/gqzdy6chjne9"

  - `ready_for_terminal` (boolean, required)
    Es true si el pago ya cuenta con todos los datos necesarios para abrir directamente la aplicación de pagos Khipu.


## Response 400 fields

## Response 401 fields

## Response 403 fields

## Response 404 fields

## Response 500 fields

# Refund payment by Id

Reembolsa total o parcialmente el monto de un pago. Esta operación solo se puede realizar en los comercios que recauden en cuenta Khipu y antes de la rendición de los fondos correspondientes.

Endpoint: POST /v3/payments/{id}/refunds
Version: v3.0
Security: Api-Key

## Path parameters:

  - `id` (string, required)
    Identificador del pago

## Request fields (application/json):

  - `amount` (number)
    El monto a devolver. Sin separador de miles y usando '.' como separador de decimales. Hasta 4 lugares decimales, dependiendo de la moneda. Si se omite el reembolso se hará por el total del monto del pago.
    Example: 1000

## Response 200 fields (application/json):

  - `message` (string, required)
    Mensaje a desplegar al usuario.
    Example: "Message."


## Response 400 fields

## Response 401 fields

## Response 403 fields

## Response 404 fields

## Response 500 fields

# Get payment prediction

Predicción acerca del resultado de un pago, si podrá o no funcionar. Información adicional como máximo posible de transferir a un nuevo destinatario.

Endpoint: GET /v3/predict
Version: v3.0
Security: Api-Key

## Query parameters:

  - `payer_email` (string, required)
    Correo electrónico del pagador

  - `bank_id` (string, required)
    Identificador del banco de origen

  - `amount` (string, required)
    Monto del pago

  - `currency` (string, required)
    Moneda en formato ISO-4217

## Response 200 fields (application/json):

  - `new_destinatary_max_amount` (number, required)
    Monto máximo para transferir a un nuevo destinatario.
    Example: 100000

  - `max_amount` (number, required)
    El monto máximo posible para transferir.
    Example: 5000000

  - `result` (string, required)
    El resultado de la predicción.
    Enum: "ok", "new_destinatary_amount_exceeded", "max_amount_exceeded", "new_destinatary_cool_down", "not_available_account"

  - `cool_down_date` (string, required)
    Fecha de término para la restricción de monto en formato ISO-8601
    Example: "2024-06-21T11:23:09.123Z"


## Response 400 fields

## Response 401 fields

## Response 403 fields

## Response 404 fields

## Response 500 fields

# Post receiver

Advertencia: Esta función sólo está disponible para los clientes que la hayan contratado de forma independiente.
Para utilizarla, póngase en contacto con nosotros en soporte@khipu.com
Crear una nueva cuenta de cobro asociada a un integrador. Necesita datos
de la cuenta de usuario asociada, datos de facturación y datos de contacto.

Endpoint: POST /v3/receivers
Version: v3.0
Security: Api-Key

## Request fields (application/json):

  - `admin_first_name` (string, required)
    Nombre de pila del administrador de la cuenta de cobro a crear.
    Example: "Nombre"

  - `admin_last_name` (string, required)
    Apellido del administrador de la cuenta de cobro a crear.
    Example: "Apellido"

  - `admin_email` (string, required)
    Correo electrónico del administrador de la cuenta de cobro a crear.
    Example: "admin@email.com"

  - `country_code` (string, required)
    Código alfanumérico de dos caracteres ISO 3166-1 del país de la cuenta de cobro a crear.
    Example: "CL"

  - `business_identifier` (string, required)
    Identificador tributario del cobrador asociado a la cuenta de cobro a crear.
    Example: "99.999.999-9"

  - `business_category` (string, required)
    Categoría tributaria o rubro tributario del cobrador asociado a la cuenta de cobro a crear.
    Example: "VENTA AL POR MAYOR DE FRUTAS Y VERDURAS"

  - `business_name` (string, required)
    Nombre tributario del cobrador asociado a la cuenta de cobro a crear.
    Example: "Nombre Tributario"

  - `business_phone` (string, required)
    Teléfono del cobrador asociado a la cuenta de cobro a crear.
    Example: "+56988887777"

  - `business_address_line_1` (string, required)
    Dirección del cobrador de la cuenta de cobro a crear.
    Example: "Calle principal 1111"

  - `business_address_line_2` (string, required)
    Segunda línea de la dirección del cobrador de la cuenta de cobro a crear.
    Example: "Oficina 3-A"

  - `business_address_line_3` (string, required)
    Tercera línea de la dirección del cobrador de la cuenta de cobro a crear.
    Example: "Santiago"

  - `contact_full_name` (string, required)
    Nombre del contacto del cobrador.
    Example: "Nombre Contacto"

  - `contact_job_title` (string, required)
    Cargo del contacto del cobrador.
    Example: "Tesorero"

  - `contact_email` (string, required)
    Correo electrónico del contacto del cobrador.
    Example: "contacto@email.com"

  - `contact_phone` (string, required)
    Teléfono del contacto del cobrador.
    Example: "+56955553333"

  - `bank_account_bank_id` (string)
    Identificador del banco.
    Example: "SDdGj"

  - `bank_account_type` (string)
    Tipo de cuenta. Es obligatorio si se utiliza el modelo alternativo de integrador de confianza.
    Example: "Cuenta Corriente"

  - `bank_account_identifier` (string)
    Identificador personal del dueño de la cuenta de banco.
    Example: "11.333.555-7"

  - `bank_account_name` (string)
    Nombre de la cuenta de banco.
    Example: "Alias Cuenta"

  - `bank_account_number` (string)
    Número de la cuenta en el banco.
    Example: "00347909823"

  - `notify_url` (string)
    URL por omisión para el webservice donde se notificará el pago.
    Example: "http://micomercio.com/account/notify_url"

  - `rendition_url` (string)
    URL para el webservice donde se notificará la rendición.
    Example: "http://micomercio.com/account/rendition_url"

## Response 200 fields (application/json):

  - `receiver_id` (string, required)
    Identificador único de la cuenta de cobro.
    Example: "934568"

  - `secret` (string, required)
    Llave secreta de la cuenta de cobro, se usa para firmar todas las peticiones.
    Example: "b2025dc47a29a04592fa3c1191110370db0e208c"

  - `api_key` (string)
    API key de la cuenta de cobro creada.
    Example: "d6ec59c7-e299-4704-840d-300442546982"


## Response 400 fields

## Response 401 fields

## Response 403 fields

## Response 404 fields

## Response 500 fields

# Get receivers

Advertencia: Esta función sólo está disponible para los clientes que la hayan contratado de forma independiente.
Para utilizarla, póngase en contacto con nosotros en soporte@khipu.com
Obtener la lista de cuentas de cobro asociadas a un integrador.

Endpoint: GET /v3/receivers/children
Version: v3.0
Security: Api-Key

## Query parameters:

  - `offset` (integer)
    Número de registros a saltar para paginación.

  - `max` (integer)
    Cantidad máxima de registros a retornar.
    Example: 100

  - `sort` (string)
    Campo por el cual ordenar los resultados.
    Enum: "id", "name", "date_created"

  - `order` (string)
    Dirección del ordenamiento.
    Enum: "asc", "desc"

## Response 200 fields (application/json):

  - `receivers` (array, required)
    Lista de cuentas de cobro asociadas al integrador.

  - `receivers.id` (integer, required)
    Identificador único de la cuenta de cobro.
    Example: 302026

  - `receivers.name` (string, required)
    Nombre de la cuenta de cobro.
    Example: "Cobrador 20260311115756"

  - `receivers.date_created` (string, required)
    Fecha de creación de la cuenta de cobro.
    Example: "2026-03-11T14:57:56Z"

  - `receivers.disabled` (boolean, required)
    Indica si la cuenta de cobro está deshabilitada.

  - `receivers.can_collect` (boolean, required)
    Indica si la cuenta de cobro puede recibir pagos.
    Example: true

  - `total` (integer, required)
    Cantidad total de cuentas de cobro asociadas al integrador.
    Example: 150


## Response 400 fields

## Response 401 fields

## Response 403 fields

## Response 404 fields

## Response 500 fields

# Get payment methods

Obtiene el listado de medios de pago disponible para una cuenta de cobrador.

Endpoint: GET /v3/merchants/{id}/paymentMethods
Version: v3.0
Security: Api-Key

## Path parameters:

  - `id` (number, required)
    Identificador de la cuenta de cobro

## Response 200 fields (application/json):

  - `paymentMethods` (array, required)
    Arreglo con métodos de pago disponibles.

  - `paymentMethods.id` (string, required)
    Identificador del medio de pago.
    Example: "simplified_transfer"

  - `paymentMethods.name` (string, required)
    Nombre del medio de pago.
    Example: "simplified_transfer"

  - `paymentMethods.logo_url` (string, required)
    URL del logo sugerido para mostrar.
    Example: "https://s3.amazonaws.com/static.khipu.com/buttons/2015/150x50-transparent.png"


## Response 400 fields

## Response 401 fields

## Response 403 fields

## Response 404 fields

## Response 500 fields

