import "./CustomSubmitButton.css";

function CustomSubmitButton({ value, loading, disabled }: { value: string, loading: boolean, disabled: boolean }) {
    return (
        <button type="submit" className="custom-submit-button w-full mb-4 p-3 max-w-lg" disabled={disabled}>
            {loading ? <span className="spinner-border animate-spin inline-block w-4 h-4 border-2 border-t-2 border-white border-t-transparent rounded-full"></span> : value}
        </button>
    )
}

export default CustomSubmitButton;