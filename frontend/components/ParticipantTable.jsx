export const ParticipantTable=({registrations}) => {
    return (
        <div className="p-grid">
                  {registrations.map(reg => {
                    const p = reg.participant_detail ?? { id: reg.participant, first_name: "?", last_name: "?", email: "" };
                    return (
                      <div key={reg.id} className="p-card">
                        <div className="p-infos"><p> {p.first_name} {p.last_name} {p.email}</p></div>
                      </div>
                    );
                  })}
        </div> 
    
    );

}
