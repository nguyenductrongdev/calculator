import { Col, Container, Row, Button } from "reactstrap"

import { useState, useEffect } from "react";

function infixToPostfix(input) {
    let stack = [], answer = [];
    const operands = {
        '+': 1,
        '-': 1,
        "*": 2,
        "/": 2,
    };

    for (let char of input.split(' ')) {
        let currentPrecedence = operands[char];

        if (currentPrecedence) {

            let peek = operands[stack[stack.length - 1]];

            // pop until the peek is smaller
            while (peek >= currentPrecedence) {
                answer.push(stack.pop());
                peek = operands[stack[stack.length - 1]];
            }

            stack.push(char);

        } else { // not operand, push to answer
            answer.push(char);
        }
    }

    while (stack.length > 0) {
        answer.push(stack.pop())
    }

    return answer.join(' ');
}

function executePostfix(str) {
    let stack = [], operand1, operand2, tempOperand;
    let operators = ['+', '-', '*', '/'];

    for (let char of str.split(' ')) {
        // char = str.charAt(i);
        if (operators.indexOf(char) >= 0) {
            // operate
            operand2 = stack.pop();
            operand1 = stack.pop();

            tempOperand = eval(operand1 + char + operand2);
            stack.push(tempOperand);

        } else {
            stack.push(char);
        }
    }
    return stack.pop();
}

function calcStatement(str) {
    let expression = infixToPostfix(str);
    let answer = executePostfix(expression);
    return answer
}

function minimizeStatement(str) {
    let statement = String(str);
    let i = 1
    while (statement.includes('(') && ++i < 100) {
        let openBracketIndex = statement.lastIndexOf('(')
        let closeBracketIndex = statement.indexOf(')', openBracketIndex)
        console.log(openBracketIndex, closeBracketIndex);
        // get calc content
        let subStatement = statement.substring(openBracketIndex, closeBracketIndex + 1)
        // calc with destroy braket
        let val = calcStatement(subStatement.slice(1, -1))
        // replace () by val
        statement = statement.replaceAll(subStatement, val);
    }
    return statement
}

function Calculator(props) {
    let [calcContent, setCalcContent] = useState("")

    let addCalcContent = (content) => {
        setCalcContent(oldContent => oldContent + String(content))
    }

    let backspaceContent = () => {
        setCalcContent(oldContent => oldContent.substr(0, oldContent.length - 1))
    }

    return (

        <Container style={{
            width: "25%",
            border: "solid 1px black",
            borderRadius: "2vw",
            padding: "2vw",
            background: '#333',
            boxShadow: "0 0 3vw black"
        }}>
            <Row>
                <Col>
                    <div className="calc-screen" style={{
                        background: "lightgrey",
                        height: "10vw",
                        borderRadius: "0.5vw",
                        padding: "1vw"
                    }}>
                        <span>{calcContent}</span>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col md="3"><Button className="w-100" onClick={() => { addCalcContent(7) }}>7</Button></Col>
                <Col md="3"><Button className="w-100" onClick={() => { addCalcContent(8) }}>8</Button></Col>
                <Col md="3"><Button className="w-100" onClick={() => { addCalcContent(9) }}>9</Button></Col>
                <Col md="3"><Button className="w-100" color="danger" onClick={() => { addCalcContent(' / ') }}>/</Button></Col>
            </Row>
            <Row>
                <Col md="3"><Button className="w-100" onClick={() => { addCalcContent(4) }}>4</Button></Col>
                <Col md="3"><Button className="w-100" onClick={() => { addCalcContent(5) }}>5</Button></Col>
                <Col md="3"><Button className="w-100" onClick={() => { addCalcContent(6) }}>6</Button></Col>
                <Col md="3"><Button className="w-100" color="danger" onClick={() => { addCalcContent(' * ') }}>X</Button></Col>
            </Row>
            <Row>
                <Col md="3"><Button className="w-100" onClick={() => { addCalcContent(1) }}>1</Button></Col>
                <Col md="3"><Button className="w-100" onClick={() => { addCalcContent(2) }}>2</Button></Col>
                <Col md="3"><Button className="w-100" onClick={() => { addCalcContent(3) }}>3</Button></Col>
                <Col md="3"><Button className="w-100" color="danger" onClick={() => { addCalcContent(' - ') }}>-</Button></Col>
            </Row>
            <Row>
                <Col md="3"><Button className="w-100" onClick={() => { addCalcContent(0) }}>0</Button></Col>
                <Col md="3"><Button className="w-100" color="info" onClick={() => { addCalcContent('.') }}>.</Button></Col>
                <Col md="3"><Button className="w-100" color="success" onClick={() => {
                    try {
                        let answer = calcStatement(minimizeStatement(calcContent));
                        setCalcContent(answer)
                    } catch {
                        setCalcContent("Error")
                    }
                }}> = </Button></Col>
                <Col md="3"><Button className="w-100" color="danger" onClick={() => { addCalcContent(" + ") }}>+</Button></Col>
            </Row>
            <Row>
                <Col md="3">
                    <Button className="w-100" color="warning" onClick={() => { setCalcContent("") }}>AC</Button>
                </Col>
                <Col md="3">
                    <Button className="w-100" color="warning" onClick={() => backspaceContent()}>
                        <i className="fas fa-backspace"></i>
                    </Button>
                </Col>
                <Col md="3">
                    <Button className="w-100" color="primary" onClick={() => { addCalcContent(" (") }}>(</Button>

                </Col>
                <Col md="3">
                    <Button className="w-100" color="primary" onClick={() => { addCalcContent(") ") }}>)</Button>
                </Col>
            </Row>
        </Container >
    )
}

export default Calculator