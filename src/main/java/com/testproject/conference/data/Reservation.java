package com.testproject.conference.data;

import java.util.Date;

public class Reservation {

	private Client responsibleClient;
	private Date startDateTime;
	private Date endDateTime;
	private Integer sequence;
	
	public Client getResponsibleClient() {
		return responsibleClient;
	}
	public void setResponsibleClient(Client responsibleClient) {
		this.responsibleClient = responsibleClient;
	}
	public Date getStartDateTime() {
		return startDateTime;
	}
	public void setStartDateTime(Date startDateTime) {
		this.startDateTime = startDateTime;
	}
	public Date getEndDateTime() {
		return endDateTime;
	}
	public void setEndDateTime(Date endDateTime) {
		this.endDateTime = endDateTime;
	}
	public Integer getSequence() {
		return sequence;
	}
	public void setSequence(Integer sequence) {
		this.sequence = sequence;
	}
}
