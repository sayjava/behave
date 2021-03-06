<script>
    import { onMount } from 'svelte';
    import { getRecords } from '../api';

    let records = [];
    let selected = null;
    let loading = true;
    let error = null;

    onMount(async () => {
        try {
            records = await getRecords();
            records = records.map((rec) =>
                Object.assign({}, rec, {
                    response: rec.matches[0],
                    headers: Object.values(rec.request.headers).splice(0, 5).join(','),
                    when: new Date(rec.timestamp).toLocaleString().split(', ').join(':'),
                }),
            );

            console.log(records[0]);
        } catch (err) {
            error = err;
        }
        loading = false;
    });

    const onSelected = (rec) => {
        selected = rec;
        console.log(rec);
    };
</script>

{#if error}
    <div class="uk-card uk-card-default uk-card-body uk-width-1-2@m uk-margin-auto">
        <h3 class="uk-card-title uk-text-danger">Error</h3>
        <p>
            {error}
        </p>
    </div>
{/if}

{#if !error && !loading && records.length === 0}
    <div class="uk-card uk-card-default uk-card-body uk-width-1-2@m uk-margin-auto">
        <h3 class="uk-card-title uk-text-primary">Records</h3>
        <p>No Records yet</p>
    </div>
{/if}

{#if loading}
    <div class="uk-card uk-card-default uk-card-body uk-width-1-2@m uk-margin-auto">
        <p>Loading Records .....</p>
    </div>
{/if}

{#if selected}
    <div id="my-id" class="uk-modal uk-open" style="display:block">
        <div class="uk-modal-dialog uk-modal-body" style="width:900px;">
            {#if selected.response}
                <h4 class="uk-modal-title">{selected.response.name}</h4>
            {:else}
                <h4 class="uk-modal-title">Record</h4>
            {/if}
            <span class="uk-text-meta">{selected.when}</span>
            <div class="uk-container">
                {#if selected.response}
                    <div class="uk-margin uk-grid">
                        <span class="uk-text-bold uk-width-1-4">Description</span>
                        <span class="uk-text-muted uk-width-3-4">{selected.response.description}</span>
                    </div>
                {/if}
                <div class="uk-margin uk-grid">
                    <span class="uk-text-primary uk-text-bolder">Request</span>
                </div>
                <div class="uk-margin uk-grid">
                    <span class="uk-text-bold uk-width-1-4">Path</span>
                    <span class="uk-text-muted uk-width-3-4 uk-text-break">{selected.request.path}</span>
                </div>
                <div class="uk-margin uk-grid">
                    <span class="uk-text-bold uk-width-1-4">Method</span>
                    <span class="uk-text-muted uk-width-3-4">{selected.request.method}</span>
                </div>

                <div class="uk-margin uk-grid">
                    <span class="uk-text-bold uk-width-1-4">Headers</span>
                    <span class="uk-text-muted uk-width-3-4">
                        {#each Object.entries(selected.request.headers) as [key, value]}
                            <div class="uk-child-width-expand uk-grid" style="margin:4px 0">
                                <div class="uk-width-1-3 uk-text-bold" style="padding-left:0px;">
                                    {key}
                                </div>
                                <div class="uk-text-break">
                                    {value}
                                </div>
                            </div>
                        {/each}
                    </span>
                </div>

                {#if selected.response}
                    <div class="uk-margin uk-grid">
                        <span class="uk-text-primary uk-text-bolder">Response</span>
                        <span />
                    </div>
                    <div class="uk-margin uk-grid">
                        <span class="uk-text-bold uk-width-1-4">Status</span>
                        <span class="uk-text-muted uk-width-3-4">{selected.response.response.statusCode}</span>
                    </div>
                    {#if selected.response.response.body}
                        <div class="uk-margin uk-grid">
                            <span class="uk-text-bold uk-width-1-4">Body</span>
                            <span class="uk-text-muted uk-width-3-4 uk-text-break"
                                >{JSON.stringify(selected.response.response.body)}</span
                            >
                        </div>
                    {/if}

                    {#if selected.response.response.file}
                        <div class="uk-margin uk-grid">
                            <span class="uk-text-bold uk-width-1-4">File</span>
                            <span class="uk-text-muted uk-width-3-4  uk-text-break"
                                >{selected.response.response.file}</span
                            >
                        </div>
                    {/if}
                {/if}
            </div>

            <p>
                {#if !selected.response}
                    <dl class="uk-description-list uk-description-list-divider">
                        <h5>No Response</h5>
                    </dl>
                {/if}
            </p>

            <p class="uk-text-right">
                <button
                    class="uk-button uk-button-default uk-modal-close"
                    type="button"
                    on:click={() => onSelected(null)}>Close</button
                >
            </p>
        </div>
    </div>
{/if}

{#if records.length > 0}
    <div>
        <table class="uk-table uk-table-divider uk-table-small">
            <thead>
                <tr>
                    <th class="uk-table-shrink">DateTime</th>
                    <th class="uk-table-shrink">Method</th>
                    <th class="uk-table-shrink">Path</th>
                    <th class="uk-table-shrink">Status</th>
                    <th class="uk-table-expand">Headers</th>
                </tr>
            </thead>
            <tbody>
                {#each records as rec}
                    <tr
                        on:click={() => onSelected(rec)}
                        style="line-height:15px;"
                        class:uk-text-warning={!rec.response}
                    >
                        <td>{rec.when}</td>
                        <td>{rec.request.method}</td>
                        <td>{rec.request.path.replace('$', '')}</td>
                        {#if rec.response}
                            <td>{rec.response.status || 200}</td>
                        {/if}
                        {#if !rec.response}
                            <td>404</td>
                        {/if}
                        <td class="uk-text-truncate">{JSON.stringify(rec.headers)}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
{/if}
