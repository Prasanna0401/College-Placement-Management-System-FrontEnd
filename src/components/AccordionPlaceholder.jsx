import { Accordion, Placeholder } from 'react-bootstrap';

const AccordionPlaceholder = () => {
  return (
    <Accordion defaultActiveKey={['1']} flush className="flex flex-col gap-4">
      {/* 4th Year */}
      <Accordion.Item
        eventKey="1"
        className="backdrop-blur-md bg-white/30 border border-white/20 rounded-lg shadow shadow-red-400"
      >
        <Accordion.Header>Fourth Year</Accordion.Header>
        <Accordion.Body>
          <Accordion flush defaultActiveKey={['Computer']} className="flex flex-col gap-2">
            {[...Array(5)].map((_, idx) => (
              <Placeholder key={idx} as="p" animation="glow">
                <Placeholder className='w-full' />
              </Placeholder>
            ))}
          </Accordion>
        </Accordion.Body>
      </Accordion.Item>

      {/* 3rd Year */}
      <Accordion.Item
        className="backdrop-blur-md bg-white/30 border border-white/20 rounded-lg shadow shadow-red-400"
      >
        <Accordion.Header>Third Year</Accordion.Header>
      </Accordion.Item>

      {/* 2nd Year */}
      <Accordion.Item
        className="backdrop-blur-md bg-white/30 border border-white/20 rounded-lg shadow shadow-red-400"
      >
        <Accordion.Header>Second Year</Accordion.Header>
      </Accordion.Item>

      {/* 1st Year */}
      <Accordion.Item
        className="backdrop-blur-md bg-white/30 border border-white/20 rounded-lg shadow shadow-red-400"
      >
        <Accordion.Header>First Year</Accordion.Header>
      </Accordion.Item>
    </Accordion>
  );
};

export default AccordionPlaceholder;
