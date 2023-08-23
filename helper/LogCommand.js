const AWS = require('aws-sdk');
const cloudwatchlogs = new AWS.CloudWatchLogs({ region: 'ap-southeast-1' }); // Replace with your desired region

const logCommand = async (searchCommand, username) => {
    const logGroupName = 'SirenLogs';
    const logStreamName = 'Commands';
    try {
        // Check if log group exists
        const describeLogGroupsParams = {
          logGroupNamePrefix: logGroupName
        };
        const describeLogGroupsResponse = await cloudwatchlogs.describeLogGroups(describeLogGroupsParams).promise();
    
        const logGroupExists = describeLogGroupsResponse.logGroups.find(group => group.logGroupName === logGroupName);
    
        if (!logGroupExists) {
          // Create log group if it doesn't exist
          await cloudwatchlogs.createLogGroup({ logGroupName }).promise();
        }
    
        // Check if log stream exists
        const describeLogStreamsParams = {
          logGroupName: logGroupName,
          logStreamNamePrefix: logStreamName
        };
        const describeLogStreamsResponse = await cloudwatchlogs.describeLogStreams(describeLogStreamsParams).promise();
    
        const logStreamExists = describeLogStreamsResponse.logStreams.find(stream => stream.logStreamName === logStreamName);
    
        if (!logStreamExists) {
          // Create log stream if it doesn't exist
          await cloudwatchlogs.createLogStream({ logGroupName, logStreamName }).promise();
        }
    
        const logEventParams = {
          logGroupName: logGroupName,
          logStreamName: logStreamName,
          logEvents: [
            {
              message: username + ": " + searchCommand,
              timestamp: Date.now()
            }
          ]
        };
    
        await cloudwatchlogs.putLogEvents(logEventParams).promise();
    
        console.log('Successfully logged to CloudWatch Logs');
        return true;
      } catch (error) {
        console.error('Error:', error);
      }
};

module.exports = {
    logCommand
}