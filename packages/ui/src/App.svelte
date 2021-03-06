<script>
    import Behaviors from './components/Behaviors.svelte';
    import Records from './components/Records.svelte';

    const calculateState = () => {
        let newState = window.location.hash.replace(`#`, '');
        if (newState === '') {
            newState = 'requests';
        }

        return newState;
    };

    let state = calculateState();
    window.addEventListener('popstate', () => {
        state = calculateState();
    });

    if (state === '') {
        state = 'requests';
    }
</script>

<div>
    <header>
        <nav class="uk-navbar-container uk-navbar">
            <div class="uk-navbar-left">
                <a href="/" class="uk-navbar-item uk-logo">Behave</a>
                <ul class="uk-navbar-nav">
                    <li class:uk-active={state === 'requests'}><a href="#requests">Requests</a></li>
                    <li class:uk-active={state === 'behaviors'}><a href="#behaviors">Behaviors</a></li>
                </ul>
            </div>
        </nav>
    </header>
    <main class="uk-padding">
        <div class="uk-container">
            {#if state === 'requests'}
                <Records />
            {/if}
            {#if state === 'behaviors'}
                <Behaviors />
            {/if}
        </div>
    </main>
</div>
