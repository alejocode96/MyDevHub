/**
 * @description Hace scroll suave hasta la sección con ese id. Se usa en vez de la
 * navegación nativa por hash (`href="#id"`) porque la app usa HashRouter (el `#` de
 * la URL es la ruta de React Router): si un click cambia el hash de verdad, el router
 * lo interpreta como una navegación a una ruta inexistente y la desmonta.
 */
export const scrollToSection = (href) => {
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};
