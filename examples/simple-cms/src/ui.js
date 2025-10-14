// UI Utilities Module

/**
 * Show loading indicator
 * @param {string} selector - Element selector to show loading in
 */
export function showLoading(selector = '#page-content') {
    const element = document.querySelector(selector);
    if (element) {
        element.innerHTML = `
            <div class="uk-flex uk-flex-center uk-margin">
                <div uk-spinner="ratio: 2"></div>
            </div>
            <p class="uk-text-center">Loading...</p>
        `;
    }
}

/**
 * Hide loading indicator
 */
export function hideLoading() {
    // Loading is replaced by content, so no need to hide explicitly
}

/**
 * Show error message
 * @param {string} message - Error message
 * @param {string} selector - Element selector
 */
export function showError(message, selector = '#page-content') {
    const element = document.querySelector(selector);
    if (element) {
        element.innerHTML = `
            <div class="uk-alert uk-alert-danger">
                <p>${message}</p>
                <button class="uk-button uk-button-small uk-button-default" onclick="location.reload()">Retry</button>
            </div>
        `;
    }
}

/**
 * Show success message
 * @param {string} message - Success message
 * @param {string} selector - Element selector
 */
export function showSuccess(message, selector = '#page-content') {
    const element = document.querySelector(selector);
    if (element) {
        // Prepend to existing content
        const alert = document.createElement('div');
        alert.className = 'uk-alert uk-alert-success';
        alert.innerHTML = `<p>${message}</p>`;
        element.insertBefore(alert, element.firstChild);

        // Auto-hide after 3 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 3000);
    }
}

/**
 * Render table from data
 * @param {Array} data - Array of objects
 * @param {Array} columns - Column definitions [{key, label}]
 * @returns {string} - HTML table
 */
export function renderTable(data, columns) {
    if (!data || data.length === 0) {
        return '<p>No data available</p>';
    }

    let html = '<table class="uk-table uk-table-striped uk-table-hover">';
    html += '<thead><tr>';
    columns.forEach(col => {
        html += `<th>${col.label}</th>`;
    });
    html += '<th>Actions</th></tr></thead><tbody>';

    data.forEach(item => {
        html += '<tr>';
        columns.forEach(col => {
            html += `<td>${item[col.key] || ''}</td>`;
        });
        html += `<td>
            <button class="uk-button uk-button-small uk-button-primary edit-btn" data-id="${item.id}">Edit</button>
            <button class="uk-button uk-button-small uk-button-danger delete-btn" data-id="${item.id}">Delete</button>
        </td>`;
        html += '</tr>';
    });

    html += '</tbody></table>';
    return html;
}

/**
 * Render form
 * @param {Array} fields - Field definitions [{name, label, type, required}]
 * @param {object} data - Form data
 * @returns {string} - HTML form
 */
export function renderForm(fields, data = {}) {
    let html = '<form class="uk-form-stacked">';

    fields.forEach(field => {
        const value = data[field.name] || '';
        const required = field.required ? 'required' : '';

        html += `
            <div class="uk-margin">
                <label class="uk-form-label" for="${field.name}">${field.label}</label>
                <div class="uk-form-controls">
                    <input class="uk-input" type="${field.type || 'text'}" id="${field.name}" name="${field.name}" value="${value}" ${required}>
                </div>
            </div>
        `;
    });

    html += `
        <div class="uk-margin">
            <button type="button" id="save-btn" class="uk-button uk-button-primary">Save</button>
            <button type="button" class="uk-button uk-button-default cancel-btn">Cancel</button>
        </div>
    </form>`;

    return html;
}