package com.testproject.conference.servlet;

import java.io.IOException;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.testproject.conference.action.*;
import com.testproject.conference.param.GlobalParameters;

/* This servlet gets all requests and invokes corresponding action */

public class MainServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;

	private ActionManager actionsManager = new ActionManagerImpl();
	
	public void service(HttpServletRequest request,
			HttpServletResponse response)
		               throws ServletException, IOException {
		
		ServletContext context = getServletContext();
		GlobalParameters.absoluteFilepath = (context.getRealPath(
				GlobalParameters.relativeFilepath));
		
		String path = request.getServletPath();
		if (path.equals("/loadbase")) { 
			actionsManager.sendBase(response);
		}
		else if (path.equals("/addtobase")){
			actionsManager.addToBase(request, response);
		}
	}
}
