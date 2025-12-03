export default {
        quote: c => c ? c.split('\n').map(line => '> ' + line).join('\n') : 'N/A',
}
