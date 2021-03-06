<script>
    import { onMount } from 'svelte';
    import { getBehaviors } from '../api';

    let behaviors = [];
    let loading = true;
    let error = null;

    onMount(async () => {
        try {
            behaviors = await getBehaviors();
        } catch (err) {
            error = err;
        }
        loading = false;
    });
</script>

{#if error}
    <div class="uk-card uk-card-default uk-card-body uk-width-1-2@m uk-margin-auto">
        <h3 class="uk-card-title uk-text-danger">Error</h3>
        <p>
            {error}
        </p>
    </div>
{/if}

{#if loading}
    <div class="uk-card uk-card-default uk-card-body uk-width-1-2@m uk-margin-auto">
        <p class="uk-text-center uk-text-muted">Loading Behaviors ....</p>
    </div>
{/if}

{#if !error && !loading && behaviors.length === 0}
    <div class="uk-card uk-card-default uk-card-body uk-width-1-2@m uk-margin-auto">
        <p class="uk-text-center uk-text-primary">No Behvaiors Found</p>
    </div>
{/if}

{#if !error && behaviors.length > 0}
    <div>
        <h3>{behaviors.length} Behaviors</h3>
        <ul class="uk-list uk-list-divider uk-margin">
            {#each behaviors as behavior}
                <li class="uk-margin">
                    <h4 class="uk-text-lead uk-text-bold">{behavior.name}</h4>
                    <p class="uk-text-meta">{behavior.description}</p>
                    <dl>
                        <dt>Limit</dt>
                        <dd>{behaviors.limit || 'unlimited'}</dd>
                    </dl>
                    <h5 class="uk-text-secondary uk-text-bold">Request</h5>
                    <table class="uk-table uk-table-striped uk-table-small">
                        <tbody>
                            <tr>
                                <td>Path</td>
                                <td>{behavior.request.path}</td>
                            </tr>
                            <tr>
                                <td>Method</td>
                                <td>{behavior.request.method}</td>
                            </tr>
                            {#if Object.keys(behavior.request.headers || {}).length > 0}
                                <tr class="uk-margin uk-maring-small">
                                    <td>Headers</td>
                                    <td>
                                        {JSON.stringify(behavior.request.headers || {})}
                                    </td>
                                </tr>
                            {/if}
                            {#if Object.keys(behavior.request.body || {}).length > 0}
                                <tr>
                                    <td>Body</td>
                                    <td>
                                        {JSON.stringify(behavior.request.body || {})}
                                    </td>
                                </tr>
                            {/if}
                        </tbody>
                    </table>

                    <h5 class="uk-text-secondary uk-text-bold">Response</h5>
                    <table class="uk-table uk-table-striped uk-table-small">
                        <tbody>
                            <tr>
                                <td>Status</td>
                                <td>{behavior.response.statusCode || 200}</td>
                            </tr>
                            {#if behavior.response.headers}
                                <tr>
                                    <td>Headers</td>
                                    <td>
                                        {JSON.stringify(behavior.response.headers)}
                                    </td>
                                </tr>
                            {/if}
                            {#if behavior.request.body}
                                <tr>
                                    <td>Body</td>
                                    <td>
                                        {JSON.stringify(behavior.response.body)}
                                    </td>
                                </tr>
                            {/if}
                            {#if behavior.response.file}
                                <tr>
                                    <td>File</td>
                                    <td>
                                        {behavior.response.file}
                                    </td>
                                </tr>
                            {/if}
                            {#if behavior.response.delay}
                                <tr>
                                    <td>Delay</td>
                                    <td>
                                        {behavior.response.delay}
                                    </td>
                                </tr>
                            {/if}
                        </tbody>
                    </table>
                </li>
            {/each}
        </ul>
    </div>
{/if}
