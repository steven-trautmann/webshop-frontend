import App from "../App";
// import Registration from "../component/Registration";
// import { configure, shallow } from "enzyme";
import React from 'react';
// import Adapter from 'enzyme-adapter-react-16';
// import ShallowRenderer from 'react-test-renderer/shallow';
import { render, screen, cleanup } from '@testing-library/react';
// import { createMemoryHistory } from 'history';
// import { Router } from 'react-router-dom';
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'


// in your test:
// const renderer = new ShallowRenderer();
// renderer.render(<Registration />);
// const container = renderer.getRenderOutput();

// configure enzyme
// configure({ adapter: new Adapter() });

afterEach(cleanup);

describe('<App />', () => {

    // const container = shallow(<Registration />) //you cannot test Registration itself, because the context's state is in another component
    // it('should have an email field', () => {
    //     expect(container.find('#email'))
    // });

    it("should render and navigate to registration", () => {
        window.history.pushState({}, "", "/")
        const { getByText } = render(<App />, { wrapper: BrowserRouter })


        expect(getByText(/Regis/i)).toBeInTheDocument();

        userEvent.click(screen.getByText(/Regis/i))

        // check that the content changed
        expect(getByText(/Send/i)).toBeInTheDocument();
    })

    it("should throw error if email is invalid", () => {
        window.history.pushState({}, "", "/registration")
        const { getByLabelText, getByText, queryByText } = render(<App />, { wrapper: BrowserRouter })

        expect(getByLabelText(/E-mail/i)).toBeInTheDocument();

        expect(queryByText(/Invalid/i)).not.toBeInTheDocument();

        userEvent.type(getByLabelText(/E-mail/i), "invalidEmail")

        expect(getByLabelText(/E-mail/i)).toHaveValue("invalidEmail");

        userEvent.click(getByText(/Send/i))

        expect(getByText(/Invalid/i)).toBeInTheDocument()

    })
})