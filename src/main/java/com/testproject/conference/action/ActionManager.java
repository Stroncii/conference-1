package com.testproject.conference.action;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/* Handles all requests */
/* "sendBase" - send information from data storage to client */
/* "addToBase" - add new entry to data file */

public interface ActionManager {

	public void sendBase(HttpServletResponse response);
	public void addToBase(HttpServletRequest request, HttpServletResponse response);
}
