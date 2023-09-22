# Extensión de Tabla para Navegadores Basados en Chromium

## Descripción

Esta extensión permite a los usuarios editar, guardar, resetear y descargar tablas. La extensión también ofrece una funcionalidad para guardar la tabla en el almacenamiento local y recuperarla más tarde. Funciona en todas las paginas de https://horario.gestion.uco.es .

## Dependencias

- [dom-to-image](https://github.com/tsayen/dom-to-image)

## Instalación

1. Clone la carpeta src del repositorio.
2. Abra la página `chrome://extensions/` en su navegador Chromium.
3. Habilite el modo de desarrollador.
4. Haga clic en "Cargar descomprimida" y seleccione la carpeta del repositorio clonado.

## Uso

Una vez instalada, la extensión agregará un nuevo icono en la barra de herramientas. Al hacer clic en él, se abrirá un menú popup con las siguientes opciones:

- **Edit Table**: Para editar la tabla.
- **Save Table**: Guarda la tabla en el almacenamiento local.
- **Original Table**: Restablece la tabla a su estado original sin cambiar la guardada.
- **Saved Table**: Recupera la tabla guardada desde el almacenamiento local.
- **Delete Storage**: Borra todas las tablas guardadas en el almacenamiento local.
- **Download Table**: Descarga la tabla como una imagen PNG.
