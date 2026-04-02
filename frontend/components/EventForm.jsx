function EventForm(){
    return (
    <div className="event-form">
        <main >
        <section>
        <h2>New Event</h2>
        <p className="event-form-subtitle">Fill in the details below to create a new event.</p>
       <form>
        <div className="field" id="field-title">
            <label htmlFor="title" className="form-label">Title <span className="form-required" aria-hidden="true">*</span></label>
            <input id="title" name="title" type="text" class="form-input" maxlength="80" placeholder="e.g. Django Paris Meetup #12" aria-required="true"/>
            <span className="form-char-count" id="titleCount">0/80</span>
            <span className="form-error" id="titleError" role="alert" style={{ display: 'none' }} ></span>
        </div>
        <div className="field" id="field-location">
            <label htmlFor="location" className="form-label">Location <span className="form-required" aria-hidden="true">*</span></label>
            <input id="location" name="location" type="text" className="form-input" maxlength="80" placeholder="e.g. Station F, Paris" aria-required="true"/>
            <span className="form-error" id="locationError" role="alert" style={{ display: 'none' }}></span>
        </div>
        <div className="field" id="field-start">
            <label htmlFor="start_datetime" className="form-label">Start</label>
            <input id="start_datetime" name="start_datetime" type="datetime-local" className="form-input"/>
            <span className="form-error" id="startError" role="alert" style={{ display: 'none' }}></span>
        </div>

        <div className="field" id="field-end">
            <label htmlFor="end_datetime" className="form-label">End</label>
            <input id="end_datetime" name="end_datetime" type="datetime-local" className="form-input"/>
            <span className="form-error" id="endError" role="alert" style={{ display: 'none' }}></span>
        </div>
      
        <div className="field" id="field-max">
            <label htmlFor="max_participants" class="form-label">Max Participants</label>
            <span className="form-hint">Leave empty for unlimited capacity.</span>
            <input id="max_participants" name="max_participants" type="number" className="form-input form-input--narrow" min="1" placeholder="e.g. 100"/>
            <span className="form-error" id="maxError" role="alert" style={{ display: 'none' }}></span>
        </div> 
        <div className="form-actions">  
            <button type="button" className="btn btn-ghost" id="cancelBtn">Cancel</button>
            <button type="submit" className="btn btn-primary" id="submitBtn">Create Event</button>
        </div>     
        </form>
        </section>
        </main>
    </div>
    )   
};

export {EventForm}